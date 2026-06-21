// "use server";
// import { createClient } from "@/lib/supabase-server";
// import { auth } from "@clerk/nextjs/server";

// export async function createEvent(formData: FormData) {
//   // 1. Authenticate user
//   const { userId } = await auth();
//   if (!userId) throw new Error("Unauthorized");

//   // 2. Initialize Supabase client
//   const supabase = await createClient();

//   // 3. Extract and safely parse data from FormData
//   const title = formData.get("title") as string;
//   const description = (formData.get("description") as string) || null;
//   const location = formData.get("location") as string;
//   const image_url = (formData.get("image_url") as string) || null;
//   const event_date = formData.get("event_date") as string;

//   // Convert numeric and integer strings to actual numbers
//   const categoryIdRaw = formData.get("category_id");
//   const category_id = categoryIdRaw
//     ? parseInt(categoryIdRaw as string, 10)
//     : null;

//   const priceRaw = formData.get("price");
//   const price = priceRaw ? parseFloat(priceRaw as string) : null;

//   const maxSeatsRaw = formData.get("max_seats");
//   const max_seats = maxSeatsRaw ? parseInt(maxSeatsRaw as string, 10) : null;

//   if (!max_seats) {
//     throw new Error("Maximum seats is required.");
//   }

//   // 4. Insert into Supabase mapping all columns from the image
//   const { data, error } = await supabase
//     .from("events")
//     .insert({
//       user_id: userId as any,
//       category_id: category_id as any,
//       title,
//       description,
//       event_date,
//       location,
//       price,
//       max_seats,
//       image_url,
//     } as any)
//     .select()
//     .single();

//   if (error) {
//     console.error("Supabase error:", error.message);
//     throw new Error(error.message);
//   }

//   return data;
// }
