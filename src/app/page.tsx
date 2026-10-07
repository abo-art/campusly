'use client';

import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Sparkles, 
  Tag, 
  Briefcase, 
  Calendar as CalendarIcon, 
  Search,
  Filter
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Listing, Job, CampusEvent, ListingCategory, JobCategory } from '@/types';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { CategoryChips } from '@/components/CategoryChips';
import { ListingCard } from '@/components/ListingCard';
import { JobCard } from '@/components/JobCard';
import { EventCard } from '@/components/EventCard';
import { ListingDetailModal } from '@/components/ListingDetailModal';
import { JobDetailModal } from '@/components/JobDetailModal';
import { EventDetailModal } from '@/components/EventDetailModal';
import { CreateListingModal } from '@/components/CreateListingModal';
import { CreateJobModal } from '@/components/CreateJobModal';
import { CreateEventModal } from '@/components/CreateEventModal';
import { AuthModal } from '@/components/AuthModal';
import { ChatModal } from '@/components/ChatModal';
import { ProfileSection } from '@/components/ProfileSection';
import { ChatsSection } from '@/components/ChatsSection';
import { SplashView } from '@/components/SplashView';
import { AuthView } from '@/components/AuthView';

export default function Home() {
  const { currentUser, isLoading } = useAuth();
  const { listings, jobs, events, openOrCreateChat } = useData();

  // Tab & search state
  const [activeTab, setActiveTab] = useState<'home' | 'jobs' | 'events' | 'chats' | 'profile'>('home');
  const [searchText, setSearchText] = useState('');
  
  // Category state
  const [selectedListingCategory, setSelectedListingCategory] = useState<ListingCategory>('All');
  const [selectedJobCategory, setSelectedJobCategory] = useState<JobCategory>('All');
  const [eventsFilter, setEventsFilter] = useState<'upcoming' | 'past'>('upcoming');

  // Selected items for modal view
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CampusEvent | null>(null);

  // Modals
  const [isCreateListingOpen, setIsCreateListingOpen] = useState(false);
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  // Client-side current timestamp
  const [nowTimestamp, setNowTimestamp] = useState<number>(0);
  React.useEffect(() => {
    setNowTimestamp(Date.now());
  }, []);

  // Filter listings
  const filteredListings = useMemo(() => {
    return listings.filter(item => {
      const matchCat = selectedListingCategory === 'All' || item.category === selectedListingCategory;
      const matchSearch = !searchText.trim() || 
        item.title.toLowerCase().includes(searchText.toLowerCase()) ||
        item.description.toLowerCase().includes(searchText.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [listings, selectedListingCategory, searchText]);

  // Filter jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter(item => {
      const matchCat = selectedJobCategory === 'All' || item.category === selectedJobCategory;
      const matchSearch = !searchText.trim() || 
        item.title.toLowerCase().includes(searchText.toLowerCase()) ||
        item.description.toLowerCase().includes(searchText.toLowerCase()) ||
        item.location.toLowerCase().includes(searchText.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [jobs, selectedJobCategory, searchText]);

  // Filter events
  const filteredEvents = useMemo(() => {
    const now = nowTimestamp || 1775580000000;
    return events.filter(item => {
      const itemTime = new Date(item.date).getTime();
      const isUpcoming = itemTime >= now - 86400000;
      const matchStatus = eventsFilter === 'upcoming' ? isUpcoming : !isUpcoming;
      const matchSearch = !searchText.trim() || 
        item.title.toLowerCase().includes(searchText.toLowerCase()) ||
        item.description.toLowerCase().includes(searchText.toLowerCase()) ||
        item.location.toLowerCase().includes(searchText.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [events, eventsFilter, searchText, nowTimestamp]);

  const handleOpenChatFromListing = async (listing: Listing) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }
    await openOrCreateChat(listing.sellerId, listing.sellerName, listing.id, listing.title);
  };

  const handleOpenChatFromJob = async (otherUserId: string, otherUserName: string, title: string) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }
    await openOrCreateChat(otherUserId, otherUserName, undefined, title);
  };

  const listingCategories: readonly ListingCategory[] = ['All', 'Books', 'Tech', 'Clothing', 'Furniture', 'Services', 'Other'];
  if (isLoading) {
    return <SplashView />;
  }

  if (!currentUser) {
    return <AuthView />;
  }

  const jobCategories: readonly JobCategory[] = ['All', 'Tutoring', 'Delivery', 'Design', 'IT', 'Marketing', 'Other'];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-[#D4AF37] selection:text-black">
      
      {/* Top Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchText={searchText}
        setSearchText={setSearchText}
        onOpenCreateListing={() => currentUser ? setIsCreateListingOpen(true) : setIsAuthOpen(true)}
        onOpenCreateJob={() => currentUser ? setIsCreateJobOpen(true) : setIsAuthOpen(true)}
        onOpenCreateEvent={() => currentUser ? setIsCreateEventOpen(true) : setIsAuthOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-24 md:pb-12">
        
        {/* Tab 1: Marketplace / Home */}
        {activeTab === 'home' && (
          <div className="space-y-5">
            {/* Apple-style Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0E1A2E]/80 via-[#0B1220] to-black border border-white/10 p-8 sm:p-12 md:p-14 text-center shadow-2xl">
              {/* Background ambient lighting */}
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] bg-[#2997FF]/15 rounded-full blur-[100px] pointer-events-none" />

              {/* Floating Large Icon with Apple Blue Halo */}
              <div className="relative inline-flex items-center justify-center mb-6 group">
                {/* Glowing halo behind icon */}
                <div className="absolute inset-0 bg-[#2997FF] rounded-3xl blur-2xl opacity-50 scale-125 group-hover:scale-135 transition-transform duration-500 -z-10" />
                <div className="absolute inset-0 bg-[#2997FF]/40 rounded-2xl blur-md scale-105 -z-10" />

                {/* The 80x80px Squircle Icon */}
                <div className="w-20 h-20 rounded-[22px] overflow-hidden border border-white/20 shadow-[0_12px_36px_rgba(41,151,255,0.4)] backdrop-blur-md transition-all duration-300 group-hover:translate-y-[-2px] group-hover:shadow-[0_16px_44px_rgba(41,151,255,0.55)]">
                  <img
                    src="/logo.jpg"
                    alt="Campusly"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Main Apple-style Typography */}
              <div className="space-y-3 max-w-2xl mx-auto relative z-10">
                <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#2997FF] block">
                  Campusly Platform
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                  Campus<span className="text-[#D4AF37]">ly</span>. The Future of Student Exchange.
                </h1>
                <p className="text-sm sm:text-base text-[#8FA3BF] max-w-lg mx-auto font-normal leading-relaxed">
                  Fast, private, and seamlessly integrated student marketplace, verified gigs, and campus events.
                </p>

                {/* Actions */}
                <div className="flex items-center justify-center gap-3 pt-4">
                  <button
                    onClick={() => currentUser ? setIsCreateListingOpen(true) : setIsAuthOpen(true)}
                    className="px-6 py-2.5 bg-[#2997FF] hover:bg-[#0077ED] text-white font-medium text-xs sm:text-sm rounded-full shadow-[0_4px_16px_rgba(41,151,255,0.4)] transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Post a Listing</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('jobs')}
                    className="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white font-medium text-xs sm:text-sm rounded-full border border-white/15 transition-all cursor-pointer"
                  >
                    Explore Gigs
                  </button>
                </div>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="sticky top-16 z-30 py-1 bg-black/60 backdrop-blur-md -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
              <CategoryChips
                categories={listingCategories}
                selectedCategory={selectedListingCategory}
                onSelect={setSelectedListingCategory}
                type="listing"
              />
            </div>

            {/* Listings Grid */}
            {filteredListings.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <Tag className="w-12 h-12 text-[#8FA3BF] mx-auto opacity-40" />
                <h3 className="text-lg font-bold text-white">No listings found</h3>
                <p className="text-xs text-[#8FA3BF] max-w-sm mx-auto">
                  {searchText
                    ? `No listings match "${searchText}". Try searching for something else.`
                    : 'Be the first student to post an item in this category!'}
                </p>
                <button
                  onClick={() => currentUser ? setIsCreateListingOpen(true) : setIsAuthOpen(true)}
                  className="mt-2 px-5 py-2 bg-[#D4AF37] text-black font-bold text-xs rounded-xl cursor-pointer"
                >
                  Create Listing
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {filteredListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onSelect={setSelectedListing}
                    onOpenChat={handleOpenChatFromListing}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Jobs / Gigs */}
        {activeTab === 'jobs' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-black text-white">Campus Jobs & Gigs</h1>
                <p className="text-xs text-[#8FA3BF]">Earn money helping fellow students on campus</p>
              </div>
              <button
                onClick={() => currentUser ? setIsCreateJobOpen(true) : setIsAuthOpen(true)}
                className="px-4 py-2 bg-[#D4AF37] hover:bg-[#b8952b] text-black font-bold text-xs rounded-xl shadow-[0_2px_10px_rgba(212,175,55,0.3)] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Post Job</span>
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="sticky top-16 z-30 py-1 bg-black/60 backdrop-blur-md -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
              <CategoryChips
                categories={jobCategories}
                selectedCategory={selectedJobCategory}
                onSelect={setSelectedJobCategory}
                type="job"
              />
            </div>

            {/* Jobs List */}
            {filteredJobs.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <Briefcase className="w-12 h-12 text-[#8FA3BF] mx-auto opacity-40" />
                <h3 className="text-lg font-bold text-white">No jobs found</h3>
                <p className="text-xs text-[#8FA3BF] max-w-sm mx-auto">
                  Check back soon or post a job opportunity for your peers!
                </p>
                <button
                  onClick={() => currentUser ? setIsCreateJobOpen(true) : setIsAuthOpen(true)}
                  className="mt-2 px-5 py-2 bg-[#D4AF37] text-black font-bold text-xs rounded-xl cursor-pointer"
                >
                  Post a Job
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {filteredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onSelect={setSelectedJob}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Events */}
        {activeTab === 'events' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-black text-white">Campus Events</h1>
                <p className="text-xs text-[#8FA3BF]">Workshops, hackathons, open mics & meetups</p>
              </div>
              <button
                onClick={() => currentUser ? setIsCreateEventOpen(true) : setIsAuthOpen(true)}
                className="px-4 py-2 bg-[#D4AF37] hover:bg-[#b8952b] text-black font-bold text-xs rounded-xl shadow-[0_2px_10px_rgba(212,175,55,0.3)] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Announce</span>
              </button>
            </div>

            {/* Segmented Filter (Upcoming vs Past) */}
            <div className="flex p-1 bg-[#0E1A2E] border border-[#1E3A5F] rounded-xl max-w-xs">
              <button
                onClick={() => setEventsFilter('upcoming')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  eventsFilter === 'upcoming'
                    ? 'bg-[#D4AF37] text-black font-bold shadow'
                    : 'text-[#8FA3BF] hover:text-white'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setEventsFilter('past')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  eventsFilter === 'past'
                    ? 'bg-[#D4AF37] text-black font-bold shadow'
                    : 'text-[#8FA3BF] hover:text-white'
                }`}
              >
                Past
              </button>
            </div>

            {/* Events List */}
            {filteredEvents.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <CalendarIcon className="w-12 h-12 text-[#8FA3BF] mx-auto opacity-40" />
                <h3 className="text-lg font-bold text-white">
                  {eventsFilter === 'upcoming' ? 'No upcoming events' : 'No past events'}
                </h3>
                <p className="text-xs text-[#8FA3BF] max-w-sm mx-auto">
                  Stay tuned for university announcements or post your own club event.
                </p>
                <button
                  onClick={() => currentUser ? setIsCreateEventOpen(true) : setIsAuthOpen(true)}
                  className="mt-2 px-5 py-2 bg-[#D4AF37] text-black font-bold text-xs rounded-xl cursor-pointer"
                >
                  Announce Event
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onSelect={setSelectedEvent}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Chats */}
        {activeTab === 'chats' && (
          <ChatsSection onRequireAuth={() => setIsAuthOpen(true)} />
        )}

        {/* Tab 5: Profile */}
        {activeTab === 'profile' && (
          currentUser ? (
            <ProfileSection
              onOpenCreateListing={() => setIsCreateListingOpen(true)}
              onEditListing={(listing) => setSelectedListing(listing)}
            />
          ) : (
            <div className="max-w-md mx-auto py-20 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#1A3560] flex items-center justify-center mx-auto text-[#D4AF37]">
                🎓
              </div>
              <h2 className="text-2xl font-bold text-white">Your Campus Profile</h2>
              <p className="text-xs text-[#8FA3BF]">
                Sign in to manage your listings, track sold items, and chat with other students.
              </p>
              <button
                onClick={() => setIsAuthOpen(true)}
                className="px-6 py-3 bg-[#D4AF37] text-black font-bold text-xs rounded-xl shadow-lg cursor-pointer"
              >
                Sign In or Register
              </button>
            </div>
          )
        )}

      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCreateListing={() => currentUser ? setIsCreateListingOpen(true) : setIsAuthOpen(true)}
      />

      {/* Global Interactive Modals */}
      <ListingDetailModal
        listing={selectedListing}
        onClose={() => setSelectedListing(null)}
        onOpenChat={handleOpenChatFromListing}
      />

      <JobDetailModal
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
        onOpenChat={handleOpenChatFromJob}
      />

      <EventDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />

      <CreateListingModal
        isOpen={isCreateListingOpen}
        onClose={() => setIsCreateListingOpen(false)}
        onRequireAuth={() => {
          setIsCreateListingOpen(false);
          setIsAuthOpen(true);
        }}
      />

      <CreateJobModal
        isOpen={isCreateJobOpen}
        onClose={() => setIsCreateJobOpen(false)}
        onRequireAuth={() => {
          setIsCreateJobOpen(false);
          setIsAuthOpen(true);
        }}
      />

      <CreateEventModal
        isOpen={isCreateEventOpen}
        onClose={() => setIsCreateEventOpen(false)}
        onRequireAuth={() => {
          setIsCreateEventOpen(false);
          setIsAuthOpen(true);
        }}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Live Chat Drawer/Modal */}
      <ChatModal />

    </div>
  );
}
