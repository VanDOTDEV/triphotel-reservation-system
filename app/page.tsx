"use client";
import React, { useState, useMemo, useEffect } from "react";
import { 
  Calendar, CheckCircle, X, Search, Star, MapPin, 
  User, LogOut, CreditCard, Trash2, Wallet, 
  BedDouble, Users, Info, ChevronRight, Mail, Lock,
  Camera, Save, Settings, ChevronLeft, Ticket, Crown, Sparkles, Eye,
  Clock, ShieldCheck, Zap
} from "lucide-react";




// UPDATED: Enhanced Data with Descriptions and Real-time Status
const HOTEL_ROOMS = [
  { 
    id: 1, name: "Oceanfront Deluxe Suite", location: "Boracay", price: 12500, rating: 4.9, capacity: 2, 
    availability: "Only 2 left",
    description: "Experience world-class luxury with a panoramic view of the white sands. Features a private jacuzzi and personalized butler service.",
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
    availability: "Available",
    description: "Located in the heart of the business district, perfect for travelers who want to be close to shopping hubs and nightlife.",
    amenities: ["Twin Beds", "City View", "Breakfast"], 
    images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800", "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?q=80&w=800"],
    tourUrl: "#"
  },
  { 
    id: 3, name: "Grand Family Penthouse", location: "Cebu", price: 24000, rating: 4.8, capacity: 6, 
    availability: "Last one!",
    description: "The ultimate family getaway. A massive multi-room suite with a full kitchen, dining area, and exclusive access to the sky-lounge.",
    amenities: ["3 Bedrooms", "Kitchen", "Pool Access"], 
    images: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800"],
    tourUrl: "#",
    isVIP: true
  },
  { id: 4, name: "Heritage Garden Loft", location: "Vigan", price: 6500, rating: 4.6, capacity: 3, availability: "Available", description: "Stay in a restored colonial-era loft with modern comforts and a peaceful view of the internal Spanish courtyard.", amenities: ["Classic Decor", "Garden View", "Spa Access"], images: ["https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=800"] },
  { id: 5, name: "Durian Luxury Villa", location: "Davao City", price: 11000, rating: 4.8, capacity: 4, availability: "Limited", description: "Eco-friendly luxury nestled at the foot of Mt. Apo. Features a private infinity pool and organic garden dining.", amenities: ["Private Pool", "Mountain View", "Eco-Friendly"], images: ["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800"] },
  { id: 6, name: "Cloud 9 Surf Shack", location: "Siargao", price: 7200, rating: 4.9, capacity: 2, availability: "Sold Out Today", description: "The premier spot for surf enthusiasts. Walking distance to the famous Cloud 9 boardwalk with island-vibes interiors.", amenities: ["Surf Storage", "Outdoor Shower", "Island Tours"], images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800"] },
  { id: 7, name: "Limestone Cliff Resort", location: "El Nido", price: 18500, rating: 4.9, capacity: 2, availability: "Available", description: "A secluded paradise accessible only by boat. Wake up to the sound of waves hitting the limestone cliffs.", amenities: ["Kayaking Incl.", "Overwater Villa", "Sunset Deck"], images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800"], isVIP: true },
  { id: 8, name: "Pine Breeze Lodge", location: "Baguio City", price: 5400, rating: 4.5, capacity: 4, availability: "Available", description: "Enjoy the cool mountain air in this cozy lodge. Perfect for groups looking for a rustic, fireplace-side retreat.", amenities: ["Fireplace", "Mountain View", "Close to Park"], images: ["https://pinebreezebaguio.com/wp-content/uploads/2019/07/deluxe-e7-01-1.jpg"] },
  { id: 9, name: "Bai Hotel", location: "Cebu City", price: 6700, rating: 4.5, capacity: 4, availability: "Available", description: "Modern, chic, and vibrant. This hotel features one of the best rooftop infinity pools in the country.", 
    amenities: ["Outdoor Infinity Lap Pool", "City View"], 
    images: ["https://cf.bstatic.com/xdata/images/hotel/max1024x768/178468323.jpg?k=639a7dcc063d34b7ff7a46b48495a97902d003c5a8fefbb9cf2b225834c72d23&o=", "https://images.summitmedia-digital.com/spotph/images/2018/11/27/bai-hotel-cebu-8.jpg"] },
];

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

  const [step, setStep] = useState<"dates" | "payment" | "processing" | "success">("dates");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numGuests, setNumGuests] = useState(1);
  const [paymentType, setPaymentType] = useState("Credit Card");
  const [isLoading, setIsLoading] = useState(false);

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
    setStep("processing");
    setTimeout(() => {
      const reservation = {
        ...selectedRoom,
        resId: `RES-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        checkIn, checkOut,
        guests: numGuests,
        nights: stayDuration,
        total: totalCost,
        paymentMethod: paymentType,
        status: "Upcoming",
        dateBooked: new Date().toLocaleDateString()
      };
      setBookings([reservation, ...bookings]);
      setStep("success");
    }, 2500);
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
        
        {user && view === "catalog" && (
          <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <h1 className="text-3xl font-black text-slate-900">Mabuhay, {user.name.split(' ')[0]}</h1>
            <p className="text-slate-500 font-medium">Ready for your next adventure?</p>
          </div>
        )}

        {view === "catalog" && (
          <>
            <div className="mb-10 overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="font-bold text-sm uppercase tracking-widest text-slate-400">Recommendations For You</h2>
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
                    <RoomCarousel images={room.images} />

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-slate-800">{room.name}</h3>
                      <span className="flex items-center gap-1 text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-lg"><Star size={12} fill="currentColor"/> {room.rating}</span>
                    </div>
                    <p className="text-slate-500 text-xs flex items-center gap-1 mb-2"><MapPin size={14} /> {room.location}</p>
                    
                    {/* NEW: Real-time Availability & Description */}
                    <p className="text-slate-600 text-xs mb-3 line-clamp-2 italic">"{room.description}"</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                       <button className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md hover:bg-blue-100 transition-colors">
                        <Eye size={12}/> Virtual Tour
                       </button>
                       {room.isVIP && (
                         <span className="flex items-center gap-1 text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md">
                           <Crown size={12}/> VIP
                         </span>
                       )}
                       <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md ${room.availability.includes('Today') ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50'}`}>
                         <Clock size={12}/> {room.availability}
                       </span>
                    </div>

                    <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                      <div>
                        <span className="text-xl font-black text-blue-900">{formatPHP(room.price)}</span>
                        <span className="text-slate-400 text-[10px] block font-bold uppercase">Base / night</span>
                      </div>
                      <button 
                        onClick={() => handleInitiateBooking(room)} 
                        disabled={room.availability.includes('Sold Out')}
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 ${room.availability.includes('Sold Out') ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                      >
                        {room.availability.includes('Sold Out') ? 'Full' : 'Book Now'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

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

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-700 rounded-3xl p-6 text-white shadow-xl">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[10px] font-black bg-amber-500 px-2 py-1 rounded-full uppercase">{user.tier}</span>
                </div>
                <div className="mb-4">
                  <p className="text-gray-200 text-xs font-bold uppercase tracking-widest">Available Points</p>
                  <h3 className="text-4xl font-black">{user.points}</h3>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full w-[65%]" />
                </div>
                <p className="text-[10px] mt-2 text-white-200 font-medium">750 points until Platinum Tier</p>
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
                </div>
                <button className="w-full mt-4 py-3 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-all">View All Rewards</button>
              </div>
            </div>
          </div>
        )}

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
          <div className="max-w-3xl mx-auto">
             <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-blue-900"><Calendar size={24} className="text-blue-600" /> My Reservations</h2>
             {bookings.length === 0 ? (
               <div className="text-center py-20 bg-white border-2 border-dashed border-slate-200 rounded-3xl">
                 <p className="text-slate-400">No bookings found.</p>
                 <button onClick={() => setView('catalog')} className="mt-4 text-blue-600 font-bold hover:underline">Start exploring</button>
               </div>
             ) : (
               <div className="space-y-6">
                 {bookings.map(b => (
                    <div key={b.resId} className="bg-white border border-slate-200 p-6 rounded-3xl flex flex-col md:flex-row gap-6 hover:shadow-lg transition-all relative overflow-hidden">
                      {/* STATUS TRACKER BAR */}
                      <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
                      
                      <img src={b.images ? b.images[0] : b.image} className="w-full md:w-40 h-40 rounded-2xl object-cover" />
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-mono text-xs text-blue-600 font-bold uppercase">{b.resId}</span>
                          <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${b.status === "Upcoming" ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                            {b.status}
                          </span>
                        </div>
                        
                        <h4 className="font-bold text-xl text-slate-900">{b.name}</h4>
                        <p className="text-slate-500 text-sm mb-4 flex items-center gap-1"><MapPin size={14}/> {b.location}</p>
                        
                        <div className="grid grid-cols-2 gap-4 py-4 border-t border-slate-100">
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase">Check-in</p>
                            <p className="font-bold text-sm">{b.checkIn}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase">Check-out</p>
                            <p className="font-bold text-sm">{b.checkOut}</p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                           <div className="flex items-center gap-2">
                              <div className="p-2 bg-slate-100 rounded-lg"><CreditCard size={14} className="text-slate-500"/></div>
                              <span className="text-xs font-medium text-slate-600">{b.paymentMethod}</span>
                           </div>
                           <p className="font-black text-blue-900 text-lg">{formatPHP(b.total)}</p>
                        </div>
                      </div>
                    </div>
                 ))}
               </div>
             )}
          </div>
        )}
      </main>

      {/* ENHANCED BOOKING MODAL */}
      {selectedRoom && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
           <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[95vh]">
            <div className="w-full md:w-80 bg-slate-50 p-8 border-r border-slate-100 flex flex-col">
              <button onClick={() => setSelectedRoom(null)} className="mb-6 flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-sm">
                <X size={18} /> Cancel
              </button>
              
              <img src={selectedRoom.images ? selectedRoom.images[0] : selectedRoom.image} className="w-full h-40 object-cover rounded-2xl mb-4" />
              <h3 className="font-bold text-xl leading-tight mb-2">{selectedRoom.name}</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">{selectedRoom.description}</p>
              
              <div className="mt-auto space-y-3">
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Stay Duration</span>
                    <span className="font-bold">{stayDuration} Night{stayDuration > 1 ? 's' : ''}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Guests</span>
                    <span className="font-bold">{numGuests}</span>
                 </div>
                 <div className="pt-4 border-t border-slate-200">
                   <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Total Payment</p>
                   <div className="text-3xl font-black text-blue-600">{formatPHP(totalCost)}</div>
                 </div>
              </div>
            </div>

            <div className="flex-1 p-10 overflow-y-auto bg-white">
              {step === "dates" && (
                <div className="animate-in fade-in slide-in-from-right-4">
                  <h4 className="text-2xl font-bold mb-2">Plan your stay</h4>
                  <p className="text-slate-500 text-sm mb-8">Select your check-in and check-out dates to continue.</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Check-in Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={18}/>
                        <input type="date" className="w-full pl-12 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Check-out Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={18}/>
                        <input type="date" className="w-full pl-12 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Number of Guests</label>
                    <div className="flex items-center gap-4 bg-slate-50 p-1 rounded-xl border border-slate-200 w-fit">
                       {[1,2,3,4].map(n => (
                         <button key={n} onClick={() => setNumGuests(n)} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${numGuests === n ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}>{n}</button>
                       ))}
                    </div>
                  </div>

                  <button disabled={!checkIn || !checkOut} onClick={() => setStep("payment")} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all disabled:opacity-50">Continue to Payment</button>
                </div>
              )}

              {step === "payment" && (
                <div className="animate-in fade-in slide-in-from-right-4">
                  <h4 className="text-2xl font-bold mb-2">Secure Payment</h4>
                  <p className="text-slate-500 text-sm mb-8">Choose your preferred payment method.</p>
                  
                  <div className="space-y-4 mb-8">
                    {[
                      { name: "Credit Card", icon: <CreditCard size={20}/>, tag: "Instant" },
                      { name: "GCash", icon: <Wallet size={20}/>, tag: "Popular" },
                      { name: "PayPal", icon: <Zap size={20}/>, tag: "International" }
                    ].map(m => (
                      <div key={m.name} onClick={() => setPaymentType(m.name)} className={`p-5 border-2 rounded-2xl cursor-pointer flex items-center justify-between transition-all ${paymentType === m.name ? "border-blue-600 bg-blue-50" : "border-slate-100 hover:border-slate-200"}`}>
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${paymentType === m.name ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>{m.icon}</div>
                          <div>
                            <p className="font-bold">{m.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{m.tag}</p>
                          </div>
                        </div>
                        {paymentType === m.name && <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white"><CheckCircle size={14}/></div>}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl mb-8 border border-green-100">
                    <ShieldCheck className="text-green-600" size={24}/>
                    <p className="text-xs text-green-700 font-medium">Your payment is encrypted and secure. StayFlow never stores your card details.</p>
                  </div>

                  <button onClick={handleBookingConfirm} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
                    Pay {formatPHP(totalCost)}
                  </button>
                </div>
              )}

              {step === "processing" && (
                <div className="h-full flex flex-col items-center justify-center text-center">
                   <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-6"></div>
                   <h4 className="text-xl font-bold">Verifying Transaction</h4>
                   <p className="text-slate-500 text-sm">Please do not close this window...</p>
                </div>
              )}

              {step === "success" && (
                <div className="text-center py-6 animate-in zoom-in-95 duration-500">
                  <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"><CheckCircle size={48} /></div>
                  <h4 className="text-3xl font-bold mb-2">Booking Confirmed!</h4>
                  <p className="text-slate-500 mb-8 max-w-xs mx-auto text-sm">Your reservation for <strong>{selectedRoom.name}</strong> is now secured. Check your email for the digital receipt.</p>
                  
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-8 text-left">
                     <p className="text-[10px] font-black text-slate-400 uppercase mb-4">Reservation Snapshot</p>
                     <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span>Guest Name</span><span className="font-bold">{user.name}</span></div>
                        <div className="flex justify-between"><span>Check-in</span><span className="font-bold">{checkIn}</span></div>
                        <div className="flex justify-between"><span>Amount Paid</span><span className="font-bold text-blue-600">{formatPHP(totalCost)}</span></div>
                     </div>
                  </div>

                  <button onClick={() => { setSelectedRoom(null); setView("my-trips"); }} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all">View My Reservations</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}