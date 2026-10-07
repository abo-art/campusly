'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  User, 
  Tag, 
  Trash2, 
  Copy, 
  Check, 
  MoreVertical,
  CheckCheck
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Message } from '@/types';

export function ChatModal() {
  const { currentUser } = useAuth();
  const { activeChat, activeChatMessages, setActiveChat, sendMessage, deleteMessage } = useData();
  const [draftText, setDraftText] = useState('');
  const [selectedMenuMessage, setSelectedMenuMessage] = useState<Message | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [deleteConfirmMessage, setDeleteConfirmMessage] = useState<Message | null>(null);
  const [deleteForEveryone, setDeleteForEveryone] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  };

  useEffect(() => {
    if (activeChat) {
      setTimeout(() => scrollToBottom(false), 50);
    }
  }, [activeChat]);

  useEffect(() => {
    scrollToBottom(true);
  }, [activeChatMessages]);

  if (!activeChat) return null;

  const myId = currentUser?.id || 'guest_user';

  const showToast = (text: string) => {
    setToastMessage(text);
    setTimeout(() => {
      setToastMessage((prev) => (prev === text ? null : prev));
    }, 2400);
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = draftText.trim();
    if (!text) return;

    // Instantly clear draft so user can type next message immediately
    setDraftText('');

    try {
      await sendMessage(activeChat.id, text);
    } catch (err) {
      console.error('Failed to send:', err);
    }
  };

  const handleOpenMenu = (msg: Message, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Calculate smart fixed coordinates so menu is never cut off
    const clientX = e.clientX || window.innerWidth / 2;
    const clientY = e.clientY || window.innerHeight / 2;

    const menuWidth = 175;
    const menuHeight = 90;

    const posX = Math.min(Math.max(clientX - 30, 16), window.innerWidth - menuWidth - 16);
    const posY = clientY + menuHeight > window.innerHeight - 20
      ? Math.max(clientY - menuHeight - 10, 16)
      : clientY + 8;

    setSelectedMenuMessage(msg);
    setMenuPosition({ x: posX, y: posY });
  };

  const closeMenu = () => {
    setSelectedMenuMessage(null);
    setMenuPosition(null);
  };

  const handleCopy = (text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    closeMenu();
    showToast('Скопировано в буфер обмена');
  };

  const handleInitiateDelete = (msg: Message) => {
    closeMenu();
    setDeleteConfirmMessage(msg);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmMessage || !activeChat) return;
    const msgId = deleteConfirmMessage.id;
    setDeleteConfirmMessage(null);

    try {
      await deleteMessage(msgId, activeChat.id);
      showToast('Сообщение удалено');
    } catch (err) {
      console.error('Failed to delete message:', err);
      showToast('Ошибка при удалении');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      
      {/* The Chat Window */}
      <div className="relative w-full max-w-lg h-[85vh] max-h-[680px] bg-[#0E1A2E] border border-[#1E3A5F] rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-4 py-3.5 bg-[#0B1220]/90 border-b border-[#1E3A5F] flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1A3560] flex items-center justify-center border border-[#D4AF37]/40">
              <User className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h2 className="text-white font-bold text-base leading-tight">
                {activeChat.otherUserName || 'Student'}
              </h2>
              {activeChat.listingTitle && (
                <div className="flex items-center gap-1 text-[11px] text-[#D4AF37] mt-0.5">
                  <Tag className="w-3 h-3" />
                  <span className="line-clamp-1">Re: {activeChat.listingTitle}</span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setActiveChat(null)}
            className="p-1.5 rounded-full text-[#8FA3BF] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-[#0B1220]/40 to-[#000000]/60 relative">
          {activeChatMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-[#8FA3BF] py-12">
              <div className="w-14 h-14 rounded-full bg-[#1A3560]/50 flex items-center justify-center mb-3 text-[#D4AF37]">
                💬
              </div>
              <p className="text-sm font-medium text-white">No messages yet</p>
              <p className="text-xs text-[#8FA3BF] mt-1 max-w-xs">
                Send a message to start negotiating or arrange a meetup on campus.
              </p>
            </div>
          ) : (
            activeChatMessages.map((msg) => {
              const isMine = msg.senderId === myId;

              const formattedTime = () => {
                try {
                  const d = msg.createdAt instanceof Date ? msg.createdAt : new Date(msg.createdAt);
                  return isNaN(d.getTime()) ? '' : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                } catch {
                  return '';
                }
              };

              return (
                <div
                  key={msg.id}
                  className={`relative flex items-center gap-1.5 group ${isMine ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Action trigger button on hover (Desktop) */}
                  {isMine && (
                    <button
                      type="button"
                      onClick={(e) => handleOpenMenu(msg, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-full text-[#8FA3BF] hover:text-white hover:bg-white/10 transition-all cursor-pointer shrink-0"
                      title="Опции"
                    >
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Message Bubble */}
                  <div
                    onContextMenu={(e) => handleOpenMenu(msg, e)}
                    onClick={(e) => {
                      // On mobile / tap, clicking opens the menu
                      if (window.innerWidth < 768) {
                        handleOpenMenu(msg, e);
                      }
                    }}
                    className={`relative max-w-[80%] px-3.5 py-2 text-sm leading-relaxed shadow-md select-text transition-all duration-150 cursor-pointer sm:cursor-default ${
                      isMine
                        ? 'bg-[#D4AF37] text-black font-medium rounded-2xl rounded-br-xs hover:brightness-105'
                        : 'bg-[#182533] text-white rounded-2xl rounded-bl-xs border border-[#233446] hover:bg-[#1c2d3d]'
                    }`}
                  >
                    {/* Message text */}
                    <div className="break-words whitespace-pre-wrap pr-1">
                      {msg.text}
                    </div>

                    {/* Timestamp & double-check (Telegram style) */}
                    <div className={`flex items-center justify-end gap-1 text-[10px] select-none mt-0.5 float-right ml-2 ${
                      isMine ? 'text-black/60' : 'text-[#8FA3BF]'
                    }`}>
                      <span>{formattedTime()}</span>
                      {isMine && (
                        <CheckCheck className="w-3 h-3 text-black/70 inline stroke-[2.2]" />
                      )}
                    </div>
                  </div>

                  {/* Action trigger for incoming messages (Copy text) */}
                  {!isMine && (
                    <button
                      type="button"
                      onClick={(e) => handleOpenMenu(msg, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-full text-[#8FA3BF] hover:text-white hover:bg-white/10 transition-all cursor-pointer shrink-0"
                      title="Опции"
                    >
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form 
          onSubmit={handleSend}
          className="p-3 bg-[#0B1220] border-t border-[#1E3A5F] flex items-center gap-2 z-10"
        >
          <input
            type="text"
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            placeholder="Message..."
            className="flex-1 bg-[#0E1A2E] text-white text-sm px-4 py-2.5 rounded-full border border-[#1E3A5F] focus:outline-none focus:border-[#D4AF37] placeholder-[#8FA3BF]/60"
            autoFocus
          />
          <button
            type="submit"
            disabled={!draftText.trim()}
            className="w-10 h-10 rounded-full bg-[#D4AF37] disabled:opacity-40 hover:bg-[#b8952b] text-black flex items-center justify-center transition-all shadow-[0_2px_10px_rgba(212,175,55,0.4)] cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4 fill-black" />
          </button>
        </form>

      </div>

      {/* FIXED FLOATING TELEGRAM CONTEXT MENU */}
      {selectedMenuMessage && menuPosition && (
        <>
          {/* Backdrop to close menu */}
          <div 
            className="fixed inset-0 z-[55] bg-transparent"
            onClick={closeMenu}
            onContextMenu={(e) => {
              e.preventDefault();
              closeMenu();
            }}
          />

          {/* Floating Card */}
          <div 
            style={{ 
              top: `${menuPosition.y}px`, 
              left: `${menuPosition.x}px` 
            }}
            onClick={(e) => e.stopPropagation()}
            className="fixed z-[60] bg-[#17212b]/95 backdrop-blur-2xl border border-white/15 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.75)] py-1.5 w-44 animate-in fade-in zoom-in-95 duration-100"
          >
            {/* Copy Option */}
            <button
              type="button"
              onClick={() => handleCopy(selectedMenuMessage.text)}
              className="w-full px-3.5 py-2 text-left text-xs text-white hover:bg-[#232e3c] flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 text-[#8FA3BF]" />
              <span>Копировать</span>
            </button>

            {/* Telegram Delete Option (Available for own messages) */}
            {selectedMenuMessage.senderId === myId && (
              <>
                <div className="my-1 border-t border-white/10" />
                <button
                  type="button"
                  onClick={() => handleInitiateDelete(selectedMenuMessage)}
                  className="w-full px-3.5 py-2 text-left text-xs text-[#FF595A] hover:bg-[#FF595A]/15 flex items-center gap-2.5 transition-colors cursor-pointer font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5 text-[#FF595A]" />
                  <span>Удалить</span>
                </button>
              </>
            )}
          </div>
        </>
      )}

      {/* TELEGRAM CONFIRMATION MODAL */}
      {deleteConfirmMessage && (
        <div 
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setDeleteConfirmMessage(null)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm bg-[#17212b] border border-white/15 rounded-2xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150"
          >
            {/* Telegram circular icon with glowing red */}
            <div className="w-14 h-14 rounded-full bg-red-500/15 border border-red-500/25 text-[#FF595A] flex items-center justify-center mx-auto shadow-[0_0_24px_rgba(255,89,90,0.25)]">
              <Trash2 className="w-7 h-7 stroke-[2.2]" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-base font-bold text-white tracking-tight">
                Удалить сообщение?
              </h3>
              <p className="text-xs text-[#8FA3BF] leading-relaxed">
                Вы действительно хотите удалить это сообщение? Это действие нельзя отменить.
              </p>
            </div>

            {/* Telegram Checkbox: Also delete for everyone */}
            <label className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors text-xs text-white select-none border border-white/5">
              <input
                type="checkbox"
                checked={deleteForEveryone}
                onChange={(e) => setDeleteForEveryone(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-[#0E1A2E] text-[#2997FF] focus:ring-0 cursor-pointer accent-[#2997FF]"
              />
              <span className="text-[#8FA3BF]">
                Удалить также для <strong className="text-white font-medium">{activeChat.otherUserName || 'собеседника'}</strong>
              </span>
            </label>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmMessage(null)}
                className="px-4 py-2.5 text-xs font-medium text-[#8FA3BF] hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-5 py-2.5 text-xs font-semibold bg-[#FF595A] hover:bg-[#e04546] text-white rounded-xl shadow-[0_4px_16px_rgba(255,89,90,0.35)] transition-all cursor-pointer"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TELEGRAM TOAST NOTIFICATION PILL */}
      {toastMessage && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[80] bg-[#17212b]/95 backdrop-blur-md border border-white/15 text-white text-xs px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <Check className="w-3.5 h-3.5 text-[#2997FF]" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
