// "use client";
// import { createEvent } from "@/app/actions/createEvent";

// interface Category {
//   id: string;
//   name: string;
// }

// export default function HostEventForm({
//   categories,
// }: {
//   categories: Category[];
// }) {
//   return (
//     <form
//       action={createEvent}
//       className="flex flex-col gap-4 max-w-lg mx-auto p-8 bg-[#111116] rounded-2xl border border-white/5"
//     >
//       <h2 className="text-xl font-bold">Host Your Event</h2>
//       <input
//         name="title"
//         placeholder="Event Title"
//         className="p-3 rounded bg-black/50 border border-white/10"
//         required
//       />
//       <input
//         name="location"
//         placeholder="Location"
//         className="p-3 rounded bg-black/50 border border-white/10"
//         required
//       />
//       <input
//         name="price"
//         type="number"
//         placeholder="Price (₹)"
//         className="p-3 rounded bg-black/50 border border-white/10"
//       />
//       <input
//         name="event_date"
//         type="datetime-local"
//         className="p-3 rounded bg-black/50 border border-white/10"
//         required
//       />
//       <input
//         name="max_seats"
//         type="number"
//         placeholder="Maximum Seats"
//         className="p-3 rounded bg-black/50 border border-white/10"
//         required
//       />
//       <select
//         name="category_id"
//         className="p-3 rounded bg-black/50 border border-white/10 text-slate-300"
//         required
//         defaultValue=""
//       >
//         <option value="" disabled>
//           Select a category
//         </option>
//         {categories.map((category) => (
//           <option key={category.id} value={category.id}>
//             {category.name}
//           </option>
//         ))}
//       </select>

//       <button
//         type="submit"
//         className="bg-blue-600 hover:bg-blue-700 transition py-3 rounded-lg font-bold text-white"
//       >
//         Create Event
//       </button>
//     </form>
//   );
// }
