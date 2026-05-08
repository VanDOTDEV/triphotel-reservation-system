"use client";
import React, { useState, useMemo, useEffect } from "react";
import { 
  Calendar, CheckCircle, X, Search, Star, MapPin, 
  User, LogOut, CreditCard, Trash2, Wallet, 
  BedDouble, Users, Info, ChevronRight, Mail, Lock,
  Camera, Save, Settings, ChevronLeft, Ticket, Crown, Sparkles, Eye
} from "lucide-react";

// FEATURE: Image Carousel Data & Virtual Tour Links
const HOTEL_ROOMS = [
  { 
    id: 1, name: "Oceanfront Deluxe Suite", location: "Boracay", price: 12500, rating: 4.9, capacity: 2, 
    amenities: ["King Bed", "Balcony", "Free WiFi"], 
    images: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=800"
    ],
    tourUrl: "#",
    isVIP: true 
  },
  { 
    id: 2, name: "Executive Twin City View", location: "Makati", price: 8900, rating: 4.7, capacity: 2, 
    amenities: ["Twin Beds", "City View", "Breakfast"], 
    images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800", "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?q=80&w=800"],
    tourUrl: "#"
  },
  { 
    id: 3, name: "Grand Family Penthouse", location: "Cebu", price: 24000, rating: 4.8, capacity: 6, 
    amenities: ["3 Bedrooms", "Kitchen", "Pool Access"], 
    images: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800"],
    tourUrl: "#",
    isVIP: true
  },
  { id: 4, name: "Heritage Garden Loft", location: "Vigan", price: 6500, rating: 4.6, capacity: 3, amenities: ["Classic Decor", "Garden View", "Spa Access"], images: ["https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=800"] },
  { id: 5, name: "Durian Luxury Villa", location: "Davao City", price: 11000, rating: 4.8, capacity: 4, amenities: ["Private Pool", "Mountain View", "Eco-Friendly"], images: ["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800"] },
  { id: 6, name: "Cloud 9 Surf Shack", location: "Siargao", price: 7200, rating: 4.9, capacity: 2, amenities: ["Surf Storage", "Outdoor Shower", "Island Tours"], images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800"] },
  { id: 7, name: "Limestone Cliff Resort", location: "El Nido", price: 18500, rating: 4.9, capacity: 2, amenities: ["Kayaking Incl.", "Overwater Villa", "Sunset Deck"], images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800"], isVIP: true },
  { id: 8, name: "Pine Breeze Lodge", location: "Baguio City", price: 5400, rating: 4.5, capacity: 4, amenities: ["Fireplace", "Mountain View", "Close to Park"], images: ["https://pinebreezebaguio.com/wp-content/uploads/2019/07/deluxe-e7-01-1.jpg"] },
  { id: 9, name: "Bai Hotel", location: "Cebu City", price: 6700, rating: 4.5, capacity: 4, amenities: ["Outdoor Infinity Lap Pool", "City View"], 
    images: ["https://cf.bstatic.com/xdata/images/hotel/max1024x768/178468323.jpg?k=639a7dcc063d34b7ff7a46b48495a97902d003c5a8fefbb9cf2b225834c72d23&o=", "https://images.summitmedia-digital.com/spotph/images/2018/11/27/bai-hotel-cebu-8.jpg"] },
];

// COMPONENT: Image Carousel
const RoomCarousel = ({ images }: { images: string[] }) => {
  const [idx, setIdx] = useState(0);
  if (!images || images.length === 0) return <div className="h-48 bg-slate-200 animate-pulse" />;
  
  const next = (e: any) => { e.stopPropagation(); setIdx((idx + 1) % images.length); };
  const prev = (e: any) => { e.stopPropagation(); setIdx((idx - 1 + images.length) % images.length); };

  return (
    <div className="relative overflow-hidden h-48 group">
      <img src={images[idx]} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" alt="room" />
      {images.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 p-1 bg-white/20 hover:bg-white/50 backdrop-blur rounded-full text-white transition-all opacity-0 group-hover:opacity-100"><ChevronLeft size={20}/></button>
          <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-white/20 hover:bg-white/50 backdrop-blur rounded-full text-white transition-all opacity-0 group-hover:opacity-100"><ChevronRight size={20}/></button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === idx ? 'bg-white' : 'bg-white/40'}`} />)}
          </div>
        </>
      )}
    </div>
  );
};

export default function StayFlowApp() {
  const [view, setView] = useState<"catalog" | "my-trips" | "profile" | "auth">("catalog");
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<any | null>(null);
  
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [guestFilter, setGuestFilter] = useState(1);

  const [step, setStep] = useState<"dates" | "payment" | "success">("dates");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numGuests, setNumGuests] = useState(1);
  const [paymentType, setPaymentType] = useState("Credit Card");
  const [isLoading, setIsLoading] = useState(false);

  // FEATURE: AI Recommendations Logic
  const aiRecommendations = useMemo(() => {
    return HOTEL_ROOMS
      .filter(r => r.rating >= 4.8)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);
  }, []);

  const stayDuration = useMemo(() => {
    if (!checkIn || !checkOut) return 1;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
    return diff > 0 ? diff : 1;
  }, [checkIn, checkOut]);

  const totalCost = useMemo(() => {
    if (!selectedRoom) return 0;
    let baseRate = selectedRoom.price;
    if (numGuests > 2) {
      const extraGuests = numGuests - 2;
      baseRate = baseRate + (selectedRoom.price * 0.15 * extraGuests);
    }
    return baseRate * stayDuration;
  }, [selectedRoom, numGuests, stayDuration]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // FEATURE: Membership initialized on login
    const newUser = { 
      name: "James Asoy David", 
      email: "jamesasoy@gmail.com",
      tier: "Gold Member",
      points: 1250,
      memberSince: "2024"
    };
    setUser(newUser);
    setEditName(newUser.name);
    setEditEmail(newUser.email);
    setView("catalog");
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setTimeout(() => {
      setUser({ ...user, name: editName, email: editEmail });
      setIsUpdatingProfile(false);
    }, 800);
  };

  const handleInitiateBooking = (room: any) => {
    if (!user) {
      setView("auth");
      setAuthMode("login");
    } else {
      setSelectedRoom(room);
      setNumGuests(guestFilter);
      setStep("dates");
    }
  };

  const handleBookingConfirm = () => {
    setIsLoading(true);
    setTimeout(() => {
      const reservation = {
        ...selectedRoom,
        id: `RES-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        checkIn, checkOut,
        guests: numGuests,
        nights: stayDuration,
        total: totalCost,
        dateBooked: new Date().toLocaleDateString()
      };
      setBookings([reservation, ...bookings]);
      setIsLoading(false);
      setStep("success");
    }, 1500);
  };

  const formatPHP = (val: number) => `₱${val.toLocaleString()}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView("catalog")}>
            <span className="font-bold tracking-tight text-xl text-blue-900">TripHotel</span>
          </div>

          <nav className="flex gap-6 items-center">
            <button onClick={() => setView("catalog")} className={`text-sm font-semibold transition-colors ${view === "catalog" ? "text-blue-600" : "text-slate-500 hover:text-slate-800"}`}>Explore</button>
            <button onClick={() => setView("my-trips")} className={`text-sm font-semibold transition-colors ${view === "my-trips" ? "text-blue-600" : "text-slate-500 hover:text-slate-800"}`}>Reservations</button>
            {user ? (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setView("profile")}
                  className={`flex items-center gap-3 pl-3 pr-1 py-1 rounded-full border transition-all ${view === 'profile' ? 'bg-blue-50 border-blue-200' : 'bg-slate-100 border-slate-200 hover:bg-slate-200'}`}
                >
                  <span className="text-xs font-bold text-slate-700">{user.name}</span>
                  <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    <User size={14} />
                  </div>
                </button>
                <button onClick={() => setUser(null)} className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Logout">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button onClick={() => setView("auth")} className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-100">Sign In</button>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        
        {/* FEATURE: Personalized Welcome Message */}
        {user && view === "catalog" && (
          <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <h1 className="text-3xl font-black text-slate-900">Mabuhay, {user.name.split(' ')[0]}</h1>
            <p className="text-slate-500 font-medium">Ready for your next adventure?</p>
          </div>
        )}

        {/* VIEW: CATALOG */}
        {view === "catalog" && (
          <>
            {/* FEATURE: AI Recommendations Strip */}
            <div className="mb-10 overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="font-bold text-sm uppercase tracking-widest text-slate-400">AI Recommendations For You</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiRecommendations.map(room => (
                  <div key={`rec-${room.id}`} onClick={() => handleInitiateBooking(room)} className="flex items-center gap-4 bg-blue-900 text-white p-4 rounded-2xl cursor-pointer hover:bg-blue-800 transition-all group">
                    <img src={room.images[0]} className="w-20 h-20 rounded-xl object-cover" />
                    <div>
                      <p className="text-[10px] font-bold text-blue-300 uppercase">Top Rated in {room.location}</p>
                      <h4 className="font-bold">{room.name}</h4>
                      <p className="text-sm font-medium text-blue-200">{formatPHP(room.price)}/night</p>
                    </div>
                    <ChevronRight className="ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-10 flex flex-col md:flex-row gap-4 items-end bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex-1 w-full">
                <label className="text-[10px] font-bold uppercase text-slate-400 mb-2 block">Destination</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 transition-all" placeholder="Search destinations..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
              </div>
              <div className="w-full md:w-48">
                <label className="text-[10px] font-bold uppercase text-slate-400 mb-2 block">Check Capacity</label>
                <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={guestFilter} onChange={(e) => setGuestFilter(Number(e.target.value))}>
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {HOTEL_ROOMS.filter(r => r.capacity >= guestFilter && (r.location.toLowerCase().includes(searchQuery.toLowerCase()) || r.name.toLowerCase().includes(searchQuery.toLowerCase()))).map(room => (
                <div key={room.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col hover:shadow-xl transition-shadow group">
                  
                  {/* FEATURE: Image Carousel replacing static image */}
                    <RoomCarousel images={room.images} />

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-slate-800">{room.name}</h3>
                      <span className="flex items-center gap-1 text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-lg"><Star size={12} fill="currentColor"/> {room.rating}</span>
                    </div>
                    <p className="text-slate-500 text-xs flex items-center gap-1 mb-2"><MapPin size={14} /> {room.location}</p>
                    
                    {/* FEATURE: Virtual Tour & VIP Badge */}
                    <div className="flex gap-2 mb-4">
                       <button className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md hover:bg-blue-100 transition-colors">
                        <Eye size={12}/> Virtual Tour
                       </button>
                       {room.isVIP && (
                         <span className="flex items-center gap-1 text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md">
                           <Crown size={12}/> VIP Package
                         </span>
                       )}
                    </div>

                    <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                      <div>
                        <span className="text-xl font-black text-blue-900">{formatPHP(room.price)}</span>
                        <span className="text-slate-400 text-[10px] block font-bold uppercase">Base / night</span>
                      </div>
                      <button onClick={() => handleInitiateBooking(room)} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all active:scale-95">Book Now</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* VIEW: PROFILE & LOYALTY SYSTEM */}
        {view === "profile" && user && (
          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                  <Settings size={24} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900">Account Settings</h2>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="bg-slate-900 p-8 flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-3xl bg-blue-500 border-4 border-slate-800 flex items-center justify-center text-white text-3xl font-black">
                      {user.name.charAt(0)}
                    </div>
                    <button className="absolute -bottom-2 -right-2 bg-white p-2 rounded-xl shadow-lg hover:bg-slate-100 transition-colors">
                      <Camera size={16} className="text-slate-600" />
                    </button>
                  </div>
                  <h3 className="text-white font-bold text-xl">{user.name}</h3>
                  <p className="text-slate-400 text-sm">{user.email}</p>
                </div>

                <form onSubmit={handleUpdateProfile} className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Display Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 font-medium" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 font-medium" />
                      </div>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-xs text-slate-500 max-w-[200px]">Update your personal details here.</p>
                    <button type="submit" disabled={isUpdatingProfile} className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50">
                      {isUpdatingProfile ? "Saving..." : <><Save size={18} /> Save Changes</>}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* FEATURE: Loyalty Rewards / Membership System & Promos */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-3xl p-6 text-white shadow-xl">
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
                    <Crown size={24} />
                  </div>
                  <span className="text-[10px] font-black bg-blue-500 px-2 py-1 rounded-full uppercase">{user.tier}</span>
                </div>
                <div className="mb-4">
                  <p className="text-blue-200 text-xs font-bold uppercase tracking-widest">Available Points</p>
                  <h3 className="text-4xl font-black">{user.points}</h3>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-300 h-full w-[65%]" />
                </div>
                <p className="text-[10px] mt-2 text-blue-200 font-medium">750 points until Platinum Tier</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl p-6">
                <h4 className="font-bold mb-4 flex items-center gap-2 text-slate-800">
                  <Ticket size={18} className="text-orange-500" /> Exclusive Promos
                </h4>
                <div className="space-y-3">
                  <div className="p-3 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50">
                    <p className="text-[10px] font-black text-slate-400 uppercase">30% OFF BORACAY</p>
                    <p className="text-sm font-bold text-blue-900">SUMMER-30</p>
                  </div>
                  <div className="p-3 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50">
                    <p className="text-[10px] font-black text-slate-400 uppercase">NEW MEMBER GIFT</p>
                    <p className="text-sm font-bold text-blue-900">WELCOME2026</p>
                  </div>
                </div>
                <button className="w-full mt-4 py-3 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-all">View All Rewards</button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: AUTH, MY RESERVATIONS, MODAL (Unchanged logic, just ensure data flow) */}
        {view === "auth" && (
           <div className="max-w-md mx-auto mt-10">
           <div className="bg-white p-10 border border-slate-200 rounded-3xl shadow-xl">
             <div className="text-center mb-8">
               <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                 <Lock size={32} />
               </div>
               <h2 className="text-2xl font-bold text-blue-900">{authMode === "login" ? "Welcome Back" : "Create Account"}</h2>
             </div>
             <form onSubmit={handleLogin} className="space-y-4">
               {authMode === "signup" && <input type="text" placeholder="Full Name" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />}
               <div className="relative">
                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <input type="email" placeholder="Email Address" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
               </div>
               <div className="relative">
                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <input type="password" placeholder="Password" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" required />
               </div>
               <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold">
                 {authMode === "login" ? "Sign In" : "Register Now"}
               </button>
             </form>
             <button onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} className="w-full text-center mt-6 text-sm text-slate-500 font-bold hover:text-blue-600 underline">
               {authMode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
             </button>
           </div>
         </div>
        )}

        {view === "my-trips" && (
          <div className="max-w-2xl mx-auto">
             <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-blue-900"><Calendar size={24} className="text-blue-600" /> My Reservations</h2>
             {bookings.length === 0 ? (
               <div className="text-center py-20 bg-white border-2 border-dashed border-slate-200 rounded-3xl">
                 <p className="text-slate-400">No bookings found.</p>
                 <button onClick={() => setView('catalog')} className="mt-4 text-blue-600 font-bold hover:underline">Start exploring</button>
               </div>
             ) : (
               <div className="space-y-4">
                 {bookings.map(b => (
                    <div key={b.id} className="bg-white border border-slate-200 p-4 rounded-2xl flex gap-4 hover:border-blue-200 transition-colors">
                      <img src={b.images ? b.images[0] : b.image} className="w-24 h-24 rounded-xl object-cover" />
                      <div className="flex-1">
                        <div className="flex justify-between font-mono text-[10px] text-blue-600 font-bold uppercase mb-1">
                          <span>{b.id}</span>
                          <span className="text-green-600 flex items-center gap-1"><CheckCircle size={10}/> Confirmed</span>
                        </div>
                        <h4 className="font-bold">{b.name}</h4>
                        <div className="flex gap-3 text-xs text-slate-500 mt-1">
                           <span>{b.checkIn} - {b.checkOut}</span>
                           <span>•</span>
                           <span className="font-bold">{b.guests} Guests</span>
                        </div>
                        <p className="font-black text-blue-900 mt-2">{formatPHP(b.total)}</p>
                      </div>
                    </div>
                 ))}
               </div>
             )}
          </div>
        )}
      </main>

      {/* MODAL: BOOKING (Unchanged but ensuring it uses the first image of carousel) */}
      {selectedRoom && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
           <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
            <div className="w-full md:w-80 bg-slate-50 p-8 border-r border-slate-100">
              <button onClick={() => setSelectedRoom(null)} className="mb-6 flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-sm">
                <X size={18} /> Cancel
              </button>
              <img src={selectedRoom.images ? selectedRoom.images[0] : selectedRoom.image} className="w-full h-40 object-cover rounded-2xl mb-4" />
              <h3 className="font-bold text-xl leading-tight">{selectedRoom.name}</h3>
              <div className="mt-6 pt-6 border-t border-slate-200">
                <div className="text-3xl font-black text-blue-600">{formatPHP(totalCost)}</div>
              </div>
            </div>

            <div className="flex-1 p-10 overflow-y-auto">
              {step === "dates" && (
                <div>
                  <h4 className="text-2xl font-bold mb-6">Stay Details</h4>
                  {/* FEATURE: Promo Code Input in Booking */}
                  <div className="mb-6 p-4 bg-orange-50 border border-orange-100 rounded-xl">
                    <label className="text-[10px] font-black text-orange-600 uppercase block mb-1">Apply Promo Code</label>
                    <div className="flex gap-2">
                      <input type="text" placeholder="Enter code" className="flex-1 bg-white border border-orange-200 px-3 py-2 rounded-lg text-sm" />
                      <button className="bg-orange-500 text-white px-4 py-2 rounded-lg text-xs font-bold">Apply</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Check-in</label>
                      <input type="date" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Check-out</label>
                      <input type="date" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
                    </div>
                  </div>
                  <button disabled={!checkIn || !checkOut} onClick={() => setStep("payment")} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold">Continue to Payment</button>
                </div>
              )}
              {step === "payment" && (
                <div>
                  <h4 className="text-2xl font-bold mb-6">Payment</h4>
                  <div className="space-y-3 mb-8">
                    {["Credit Card", "GCash", "PayPal"].map(m => (
                      <div key={m} onClick={() => setPaymentType(m)} className={`p-4 border-2 rounded-2xl cursor-pointer flex justify-between ${paymentType === m ? "border-blue-600 bg-blue-50" : "border-slate-100"}`}>
                        <span className="font-bold">{m}</span>
                        {paymentType === m && <CheckCircle size={20} className="text-blue-600" />}
                      </div>
                    ))}
                  </div>
                  <button onClick={handleBookingConfirm} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold">
                    {isLoading ? "Processing..." : `Pay ${formatPHP(totalCost)}`}
                  </button>
                </div>
              )}
              {step === "success" && (
                <div className="text-center py-10">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle size={40} /></div>
                  <h4 className="text-3xl font-bold mb-2">All Set!</h4>
                  <p className="text-slate-500 mb-8">Booking details sent to {user.email}.</p>
                  <button onClick={() => { setSelectedRoom(null); setView("my-trips"); }} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold">View My Trips</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}