'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { Bookmark as BookmarkIcon } from 'lucide-react'

type Bookmark = {
  id: string
  url: string
  title: string
  user_id: string
  created_at: string
}

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [adding, setAdding] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)
      setLoading(false)
    }

    getUser()
  }, [router, supabase.auth])

  useEffect(() => {
    if (!user) return

    const fetchBookmarks = async () => {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching bookmarks:', error)
        toast.error('Failed to load bookmarks')
      } else {
        setBookmarks(data || [])
      }
    }

    fetchBookmarks()

    // Subscribe to real-time changes
    const channel = supabase
      .channel('bookmarks_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBookmarks((prev) => [payload.new as Bookmark, ...prev])
          } else if (payload.eventType === 'DELETE') {
            setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, supabase])

  const handleAddBookmark = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url || !title || !user) return

    setAdding(true)
    const loadingToast = toast.loading('Adding bookmark...')
    
    try {
      const { data, error } = await supabase.from('bookmarks').insert({
        url,
        title,
        user_id: user.id,
      }).select()

      if (error) {
        console.error('Error adding bookmark:', error)
        toast.error('Failed to add bookmark', { id: loadingToast })
      } else if (data && data.length > 0) {
        // Immediately add the new bookmark to state for instant UI update
        setBookmarks((prev) => [data[0] as Bookmark, ...prev])
        setUrl('')
        setTitle('')
        toast.success('Bookmark added successfully! 🎉', { id: loadingToast })
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('An unexpected error occurred', { id: loadingToast })
    } finally {
      setAdding(false)
    }
  }

  const handleDeleteBookmark = async (id: string, bookmarkTitle: string) => {
    setDeletingId(id)
    const loadingToast = toast.loading('Deleting bookmark...')
    
    try {
      const { error } = await supabase.from('bookmarks').delete().eq('id', id)

      if (error) {
        console.error('Error deleting bookmark:', error)
        toast.error('Failed to delete bookmark', { id: loadingToast })
      } else {
        // Optimistically remove from UI
        setBookmarks((prev) => prev.filter((b) => b.id !== id))
        toast.success(`"${bookmarkTitle}" deleted`, { id: loadingToast })
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('An unexpected error occurred', { id: loadingToast })
    } finally {
      setDeletingId(null)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mb-4"></div>
          <div className="text-white text-xl font-semibold">Loading your bookmarks...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '10px',
            padding: '16px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-300 opacity-10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 gap-4">
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <BookmarkIcon className="w-10 h-10 sm:w-12 sm:h-12 text-white drop-shadow-lg" strokeWidth={2.5} />
              <h1 className="text-4xl sm:text-5xl font-bold text-white drop-shadow-lg">
                My Bookmarks
              </h1>
            </div>
            <p className="text-white/80 text-sm sm:text-base ml-0 sm:ml-1">
              Welcome back, {user?.email?.split('@')[0]}!
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="px-6 py-2.5 text-sm font-medium text-white bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-300 hover:scale-105 active:scale-95 border border-white/30 shadow-lg"
          >
            Sign Out
          </button>
        </div>

        {/* Add Bookmark Form */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 mb-8 transform transition-all duration-300 hover:shadow-3xl border border-white/30 animate-slide-up">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
            📌 Add New Bookmark
          </h2>
          <form onSubmit={handleAddBookmark} className="space-y-5">
            <div className="group">
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter bookmark title"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:border-indigo-400 bg-gray-50/50 text-gray-900 placeholder:text-gray-500"
              />
            </div>
            <div className="group">
              <label htmlFor="url" className="block text-sm font-semibold text-gray-700 mb-2">
                URL
              </label>
              <input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:border-indigo-400 bg-gray-50/50 text-gray-900 placeholder:text-gray-500"
              />
            </div>
            <button
              type="submit"
              disabled={adding}
              className="cursor-pointer w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
            >
              {adding ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding...
                </>
              ) : (
                <>
                  <span className="text-xl">+</span>
                  Add Bookmark
                </>
              )}
            </button>
          </form>
        </div>

        {/* Bookmarks List */}
        <div className="space-y-4">
          {bookmarks.length === 0 ? (
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-12 text-center border border-white/30 animate-fade-in">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-gray-600 text-lg font-medium">No bookmarks yet</p>
              <p className="text-gray-400 text-sm mt-2">Add your first bookmark to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {bookmarks.map((bookmark, index) => (
                <div
                  key={bookmark.id}
                  className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-white/30 group transform hover:-translate-y-1 animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors duration-300 line-clamp-2">
                        {bookmark.title}
                      </h3>
                      <a
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-purple-600 text-sm break-all transition-colors duration-300 hover:underline line-clamp-2 block"
                      >
                        {bookmark.url}
                      </a>
                      <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(bookmark.created_at).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteBookmark(bookmark.id, bookmark.title)}
                      disabled={deletingId === bookmark.id}
                      className="flex-shrink-0 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 disabled:opacity-50 transform hover:scale-110 active:scale-95"
                      title="Delete bookmark"
                    >
                      {deletingId === bookmark.id ? (
                        <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
          animation-fill-mode: both;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}
