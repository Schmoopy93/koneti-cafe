import Menu from "@/components/menu/Menu";

export const metadata = {
  title: "Menu",
  description: "Pregledajte naš meni sa svim dostupnim pićima",
};

export default async function MenuPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, { cache: "no-store" });
  const categories = await res.json();

  return <Menu initialCategories={categories} />;
}
