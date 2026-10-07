'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { 
  collection, 
  addDoc, 
  setDoc,
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp, 
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Listing, Job, CampusEvent, Chat, Message, ListingCategory, JobCategory } from '@/types';
import { useAuth } from './AuthContext';

interface DataContextType {
  listings: Listing[];
  jobs: Job[];
  events: CampusEvent[];
  chats: Chat[];
  activeChat: Chat | null;
  activeChatMessages: Message[];
  isLoadingData: boolean;
  
  // Listing Actions
  createListing: (data: Omit<Listing, 'id' | 'createdAt'>) => Promise<string>;
  updateListing: (id: string, data: Partial<Listing>) => Promise<void>;
  deleteListing: (id: string) => Promise<void>;
  toggleListingSold: (id: string) => Promise<void>;

  // Job Actions
  createJob: (data: Omit<Job, 'id' | 'createdAt'>) => Promise<string>;
  deleteJob: (id: string) => Promise<void>;

  // Event Actions
  createEvent: (data: Omit<CampusEvent, 'id' | 'createdAt'>) => Promise<string>;
  deleteEvent: (id: string) => Promise<void>;

  // Chat Actions
  setActiveChat: (chat: Chat | null) => void;
  openOrCreateChat: (otherUserId: string, otherUserName: string, listingId?: string, listingTitle?: string) => Promise<Chat>;
  sendMessage: (chatId: string, text: string) => Promise<void>;
  deleteMessage: (messageId: string, chatId: string) => Promise<void>;
}

const DataContext = createContext<DataContextType>({} as DataContextType);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAuth();

  const [listings, setListings] = useState<Listing[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [activeChatMessages, setActiveChatMessages] = useState<Message[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const deletedMessageIds = useRef<Set<string>>(new Set());

  // Strictly confidential: Only subscribe to database when user is authenticated
  useEffect(() => {
    if (!currentUser) {
      setListings([]);
      setJobs([]);
      setEvents([]);
      setChats([]);
      setActiveChat(null);
      setActiveChatMessages([]);
      setIsLoadingData(false);
      return;
    }

    setIsLoadingData(true);

    // 1. Listings
    let unsubListings = () => {};
    try {
      const q = query(collection(db, 'listings'), orderBy('createdAt', 'desc'));
      unsubListings = onSnapshot(q, (snapshot) => {
        const items: Listing[] = snapshot.docs.map((docSnap) => {
          const d = docSnap.data();
          return {
            id: docSnap.id,
            title: d.title || '',
            description: d.description || '',
            price: Number(d.price) || 0,
            category: (d.category as ListingCategory) || 'Other',
            sellerId: d.sellerId || '',
            sellerName: d.sellerName || 'Student',
            imageURL: d.imageURL,
            createdAt: d.createdAt?.toDate ? d.createdAt.toDate() : new Date(),
            isSold: Boolean(d.isSold)
          };
        });
        setListings(items);
        setIsLoadingData(false);
      }, () => {
        setIsLoadingData(false);
      });
    } catch {
      setIsLoadingData(false);
    }

    // 2. Jobs
    let unsubJobs = () => {};
    try {
      const q = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'));
      unsubJobs = onSnapshot(q, (snapshot) => {
        const items: Job[] = snapshot.docs.map((docSnap) => {
          const d = docSnap.data();
          return {
            id: docSnap.id,
            title: d.title || '',
            description: d.description || '',
            price: Number(d.price) || 0,
            duration: d.duration || '',
            location: d.location || '',
            category: (d.category as JobCategory) || 'Other',
            posterName: d.posterName || 'Student',
            posterId: d.posterId || '',
            createdAt: d.createdAt?.toDate ? d.createdAt.toDate() : new Date()
          };
        });
        setJobs(items);
      }, () => {});
    } catch {}

    // 3. Events
    let unsubEvents = () => {};
    try {
      const q = query(collection(db, 'events'));
      unsubEvents = onSnapshot(q, (snapshot) => {
        const items: CampusEvent[] = snapshot.docs.map((docSnap) => {
          const d = docSnap.data();
          return {
            id: docSnap.id,
            title: d.title || '',
            description: d.description || '',
            date: d.date?.toDate ? d.date.toDate() : new Date(d.date || Date.now()),
            time: d.time || '',
            location: d.location || '',
            imageURL: d.imageURL,
            organizerId: d.organizerId || '',
            organizerName: d.organizerName || 'Organizer',
            createdAt: d.createdAt?.toDate ? d.createdAt.toDate() : new Date()
          };
        });
        setEvents(items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      }, () => {});
    } catch {}

    // 4. Confidential Chats for current user only
    let unsubChats = () => {};
    try {
      const q = query(
        collection(db, 'chats'),
        where('participants', 'array-contains', currentUser.id)
      );

      unsubChats = onSnapshot(q, (snapshot) => {
        const userChats: Chat[] = snapshot.docs.map((d) => {
          const data = d.data();
          const otherUserId = data.participants?.find((p: string) => p !== currentUser.id);
          const resolvedName = data.participantNames?.[otherUserId] || data.otherUserName || (otherUserId && otherUserId.length < 24 ? otherUserId : 'Student');
          return {
            id: d.id,
            participants: data.participants || [],
            lastMessage: data.lastMessage || '',
            lastMessageAt: data.lastMessageAt?.toDate ? data.lastMessageAt.toDate() : new Date(),
            listingId: data.listingId,
            listingTitle: data.listingTitle,
            otherUserName: resolvedName
          };
        });
        userChats.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
        setChats(userChats);
      }, () => {});
    } catch {}

    return () => {
      unsubListings();
      unsubJobs();
      unsubEvents();
      unsubChats();
    };
  }, [currentUser]);

  // 5. Real-time subscription to Messages for active chat
  useEffect(() => {
    const activeChatId = activeChat?.id;
    if (!currentUser || !activeChatId) {
      setActiveChatMessages([]);
      return;
    }

    let unsubscribe = () => {};
    try {
      // Query messages strictly by chatId to eliminate composite index requirements
      const q = query(
        collection(db, 'messages'),
        where('chatId', '==', activeChatId)
      );

      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const serverMsgs: Message[] = snapshot.docs
            .filter((d) => !deletedMessageIds.current.has(d.id))
            .map((d) => {
              const data = d.data();
              return {
                id: d.id,
                chatId: data.chatId,
                senderId: data.senderId,
                text: data.text,
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date()
              };
            });

          // Merge server messages with unconfirmed local messages
          setActiveChatMessages((current) => {
            const localPending = current.filter(
              (local) =>
                !serverMsgs.some((server) => server.id === local.id) &&
                !deletedMessageIds.current.has(local.id)
            );
            const merged = [...serverMsgs, ...localPending];
            merged.sort(
              (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
            return merged;
          });
        },
        (error) => {
          console.error('Messages snapshot listener error:', error);
        }
      );
    } catch (err) {
      console.error('Messages subscription setup error:', err);
    }

    return () => unsubscribe();
  }, [currentUser?.id, activeChat?.id]);

  // Mutations
  const createListing = async (data: Omit<Listing, 'id' | 'createdAt'>): Promise<string> => {
    const docRef = await addDoc(collection(db, 'listings'), {
      ...data,
      isSold: false,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  };

  const updateListing = async (id: string, data: Partial<Listing>) => {
    await updateDoc(doc(db, 'listings', id), data);
  };

  const deleteListing = async (id: string) => {
    await deleteDoc(doc(db, 'listings', id));
  };

  const toggleListingSold = async (id: string) => {
    const listing = listings.find(l => l.id === id);
    if (!listing) return;
    const newSoldState = !listing.isSold;
    await updateDoc(doc(db, 'listings', id), { isSold: newSoldState });
  };

  const createJob = async (data: Omit<Job, 'id' | 'createdAt'>): Promise<string> => {
    const docRef = await addDoc(collection(db, 'jobs'), {
      ...data,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  };

  const deleteJob = async (id: string) => {
    await deleteDoc(doc(db, 'jobs', id));
  };

  const createEvent = async (data: Omit<CampusEvent, 'id' | 'createdAt'>): Promise<string> => {
    const docRef = await addDoc(collection(db, 'events'), {
      ...data,
      date: Timestamp.fromDate(new Date(data.date)),
      createdAt: serverTimestamp()
    });
    return docRef.id;
  };

  const deleteEvent = async (id: string) => {
    await deleteDoc(doc(db, 'events', id));
  };

  const openOrCreateChat = async (
    otherUserId: string, 
    otherUserName: string, 
    listingId?: string, 
    listingTitle?: string
  ): Promise<Chat> => {
    if (!currentUser) throw new Error('Must be logged in to chat');
    const myId = currentUser.id;

    const existing = chats.find(c => 
      c.participants.includes(otherUserId) && 
      (listingId ? c.listingId === listingId : true)
    );

    if (existing) {
      const resolved = { ...existing, otherUserName };
      setActiveChat(resolved);
      return resolved;
    }

    const newChatData = {
      participants: [myId, otherUserId],
      participantNames: {
        [myId]: currentUser.name,
        [otherUserId]: otherUserName
      },
      lastMessage: '',
      lastMessageAt: serverTimestamp(),
      listingId: listingId || null,
      listingTitle: listingTitle || null
    };

    const docRef = await addDoc(collection(db, 'chats'), newChatData);

    const createdChat: Chat = {
      id: docRef.id,
      participants: [myId, otherUserId],
      lastMessage: '',
      lastMessageAt: new Date(),
      listingId,
      listingTitle,
      otherUserName
    };

    setChats(prev => [createdChat, ...prev]);
    setActiveChat(createdChat);
    return createdChat;
  };

  const sendMessage = async (chatId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed || !currentUser) return;
    const myId = currentUser.id;

    // 1. Generate permanent Firestore document reference client-side
    const msgDocRef = doc(collection(db, 'messages'));
    const messageId = msgDocRef.id;

    const optimisticMsg: Message = {
      id: messageId,
      chatId,
      senderId: myId,
      text: trimmed,
      createdAt: new Date()
    };

    setActiveChatMessages(prev => [...prev, optimisticMsg]);

    // 2. Immediately update conversation preview in UI
    setActiveChat(prev =>
      prev && prev.id === chatId
        ? { ...prev, lastMessage: trimmed, lastMessageAt: new Date() }
        : prev
    );

    setChats(prevChats =>
      prevChats.map(c =>
        c.id === chatId
          ? { ...c, lastMessage: trimmed, lastMessageAt: new Date() }
          : c
      )
    );

    // 3. Persist with setDoc using the pre-generated document ID
    Promise.all([
      setDoc(msgDocRef, {
        chatId,
        senderId: myId,
        text: trimmed,
        createdAt: serverTimestamp()
      }),
      updateDoc(doc(db, 'chats', chatId), {
        lastMessage: trimmed,
        lastMessageAt: serverTimestamp()
      })
    ]).catch(err => {
      console.error('Error saving message to Firestore:', err);
    });
  };

  const deleteMessage = async (messageId: string, chatId: string) => {
    // 1. Mark in tombstone set so onSnapshot will never resurrect it
    deletedMessageIds.current.add(messageId);

    // 2. Optimistic instant deletion (0ms)
    setActiveChatMessages(prev => prev.filter(m => m.id !== messageId));

    // 3. Optimistically update last message in conversation preview
    setChats(prevChats =>
      prevChats.map(c => {
        if (c.id !== chatId) return c;
        const remaining = activeChatMessages.filter(m => m.id !== messageId);
        const lastMsg = remaining.length > 0 ? remaining[remaining.length - 1] : null;
        return {
          ...c,
          lastMessage: lastMsg ? lastMsg.text : '',
          lastMessageAt: lastMsg ? lastMsg.createdAt : new Date()
        };
      })
    );

    // 4. Persist deletion in Firestore
    try {
      await deleteDoc(doc(db, 'messages', messageId));

      const remaining = activeChatMessages.filter(m => m.id !== messageId);
      const lastMsg = remaining.length > 0 ? remaining[remaining.length - 1] : null;
      await updateDoc(doc(db, 'chats', chatId), {
        lastMessage: lastMsg ? lastMsg.text : '',
        lastMessageAt: lastMsg?.createdAt 
          ? (lastMsg.createdAt?.toDate ? lastMsg.createdAt : new Date(lastMsg.createdAt))
          : serverTimestamp()
      }).catch(() => {});
    } catch (err) {
      console.error('Error deleting message from Firestore:', err);
    }
  };

  return (
    <DataContext.Provider value={{
      listings,
      jobs,
      events,
      chats,
      activeChat,
      activeChatMessages,
      isLoadingData,
      createListing,
      updateListing,
      deleteListing,
      toggleListingSold,
      createJob,
      deleteJob,
      createEvent,
      deleteEvent,
      setActiveChat,
      openOrCreateChat,
      sendMessage,
      deleteMessage
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
