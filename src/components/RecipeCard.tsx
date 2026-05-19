import React from "react"; interface RecipeCardProps { recipe: { id: string; nome: string; descricao: string; preco: number; categoria: string; }; onAdd: () => void; onReject: () => void; isInCart: boolean; } const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onAdd, onReject, isInCart }) => { const { id, nome, descricao, preco, categoria } = recipe; return ( <div style={{ background: "white", borderRadius: 20, boxShadow: "0 8px 32px rgba(0,0,0,0.13)", padding: 0, overflow: "hidden", maxWidth: 320 }}> <img src={`https://picsum.photos/seed/${id}/300/200`} alt={nome} style={{ width: "100%", height: 180, objectFit: "cover" }} /> <div style={{ padding: 16 }}> <span style={{ background: "#FF6B35", color: "white", borderRadius: 50, padding: "4px 12px", fontSize: 12, fontWeight: 700 }}>#{id}</span> <span style={{ background: "#9B59B6", color: "white", borderRadius: 50, padding: "4px 12px", fontSize: 11, fontWeight: 600, marginLeft: 8 }}>{categoria}</span> <h3 style={{ margin: "12px 0 4px", fontSize: 18 }}>{nome}</h3> <p style={{ color: "#666", fontSize: 14, margin: "0 0 12px" }}>{descricao}</p> <p style={{ color: "#7BC843", fontSize: 22, fontWeight: 700, margin: "0 0 12px" }}>R$ {preco.toFixed(2)}</p> {isInCart ? ( <span style={{ color: "green", fontWeight: 700 }}>✓ No carrinho</span> ) : ( <> <button onClick={onAdd} style={{ width: "100%", background: "#7BC843", color: "white", border: "none", borderRadius: 12, padding: "12px", fontWeight: 700, cursor: "pointer", marginBottom: 8 }}>+ Adicionar ao Carrinho</button> <button onClick={onReject} style={{ width: "100%", background: "#ff5252", color: "white", border: "none", borderRadius: 10, padding: "8px", cursor: "pointer" }}>✕ Rejeitar</button> </> )} </div> </div> ); }; export default RecipeCard; ＜/dyad-write>

Now Index.tsx: We need to update the usage of RecipeCard. Let's rewrite the relevant parts.

We need to replace the two usages:

1. In the modal overlay for showRecipe:

<RecipeCard id={showRecipe.id} nome={showRecipe.nome} descricao={showRecipe.descricao} preco={showRecipe.preco} categoria={showRecipe.categoria} inCart={isInCart(showRecipe.id)} onAdd={() => handleRecipeAdd(showRecipe)} onReject={handleRecipeReject} />

Change to:

<RecipeCard recipe={showRecipe} onAdd={() => handleRecipeAdd(showRecipe)} onReject={handleRecipeReject} isInCart={isInCart(showRecipe.id)} />

2. In the map of foundRecipes:

{foundRecipes.map((recipe) => ( <RecipeCard key={recipe.id} id={recipe.id} nome={recipe.nome} descricao={recipe.descricao} preco={recipe.preco} categoria={recipe.categoria} inCart={isInCart(recipe.id)} onAdd={() => handleRecipeAdd(recipe)} onReject={handleRecipeReject} /> ))}

Change to:

{foundRecipes.map((recipe) => ( <RecipeCard key={recipe.id} recipe={recipe} onAdd={() => handleRecipeAdd(recipe)} onReject={handleRecipeReject} isInCart={isInCart(recipe.id)} /> ))}

Also ensure that the import of RecipeCard is default (it already is). Also ensure that the component uses the correct props.

Let's rewrite the entire Index.tsx file with the changes. However we need to be careful to keep the rest of the file unchanged except for those lines.

We'll produce a ＜dyad-write> for Index.tsx with the modifications.

But note: The file is long; we need to provide the entire file content with modifications. However we can just provide the diff? The instruction says to use ＜dyad-write> for creating or updating files. We need to supply the entire file content (the whole file) with modifications. That's a lot, but we can do it.

Let's extract the current Index.tsx content (from the provided context). It starts with:

＜dyad-file path="src/pages/Index.tsx"> "use client"; import { useState } from "react"; import { Header } from "@/components/Header"; import { GamificationBar } from "@/components/GamificationBar"; import { CodeInput } from "@/components/CodeInput"; import RecipeCard from "@/components/RecipeCard"; import { Cart } from "@/components/Cart"; import { CheckoutModal } from "@/components/CheckoutModal"; import { UpsellCard } from "@/components/UpsellCard"; import { UpsellModal } from "@/components/UpsellModal"; import { CategoryCard } from "@/components/CategoryCard"; import { PackCard } from "@/components/PackCard"; import { ComboCard } from "@/components/ComboCard"; import { ErrorToast } from "@/components/ErrorToast"; import { recipes, type Recipe } from "@/data/recipes"; import { upsells } from "@/data/upsells"; import { categories } from "@/data/categories"; import { packs, combos } from "@/data/packs"; interface CartItem { id: string; nome: string; preco: number; tipo: "recipe" | "pack" | "combo" | "upsell"; } export default function Index() { const [cart, setCart] = useState<CartItem[]>([]); const [showRecipe, setShowRecipe] = useState<Recipe | null>(null); const [showCheckout, setShowCheckout] = useState(false); const [activeUpsell, setActiveUpsell] = useState<string | null>(null); const [error, setError] = useState<string | null>(null); const [foundRecipes, setFoundRecipes] = useState<Recipe[]>([]); const addToCart = (item: CartItem) => { setCart((prev) => { if (prev.find((i) => i.id === item.id)) return prev; return [...prev, item]; }); if (showRecipe) setShowRecipe(null); }; const removeFromCart = (id: string) => { setCart((prev) => prev.filter((i) => i.id !== id)); }; const total = cart.reduce((sum, item) => sum + item.preco, 0); const handleRecipeFound = (recipe: Recipe) => { setError(null); setShowRecipe(recipe); }; const handleRecipeNotFound = () => { setError("Codigo nao encontrado. Verifique o numero e tente novamente."); setTimeout(() => setError(null), 3000); }; const handleRecipeAdd = (recipe: Recipe) => { addToCart({ id: recipe.id, nome: recipe.nome, preco: recipe.preco, tipo: "recipe" }); setFoundRecipes((prev) => { if (prev.find((r) => r.id === recipe.id)) return prev; return [...prev, recipe]; }); }; const handleRecipeReject = () => { setShowRecipe(null); }; const handlePackAdd = (packId: string) => { const pack = packs.find((p) => p.id === packId); if (pack) addToCart({ id: pack.id, nome: pack.nome, preco: pack.precoAtual, tipo: "pack" }); }; const handlePackRemove = (packId: string) => { removeFromCart(packId); }; const handleComboAdd = (comboId: string) => { const combo = combos.find((c) => c.id === comboId); if (combo) addToCart({ id: combo.id, nome: combo.nome, preco: combo.preco, tipo: "combo" }); }; const handleComboRemove = (comboId: string) => { removeFromCart(comboId); }; const handleUpsellBuy = () => { if (activeUpsell) { const upsell = upsells.find((u) => u.id === activeUpsell); if (upsell) addToCart({ id: upsell.id, nome: upsell.nome, preco: upsell.precoAtual, tipo: "upsell" }); setActiveUpsell(null); } }; const isInCart = (id: string) => cart.some((item) => item.id === id); return ( <div className="min-h-screen pb-20" style={{ backgroundColor: "#FFF8F2" }}> <Header /> <section className="max-w-6xl mx-auto px-4"> <div className="banner"> <span className="absolute left-4 top-4 text-5xl font-bold text-gray-600 opacity-60">🧶</span> <span className="absolute right-4 bottom-4 text-5xl font-bold text-gray-600 opacity-60">✂️</span> <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-3" style={{ fontFamily: "'Fredoka One', cursive", textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}> 🧶 Suas receitas de amigurumi, na hora, no seu WhatsApp! </h1> <p className="text-white/80 text-sm sm:text-base max-w-lg mx-auto"> Digite o codigo da receita que voce viu no grupo e adicione ao carrinho </p> </div> <GamificationBar cartCount={cart.length} /> <CodeInput onRecipeFound={handleRecipeFound} onRecipeNotFound={handleRecipeNotFound} /> {error && <ErrorToast message={error} onClose={() => setError(null)} />} {showRecipe && ( <div className="modal-overlay" onClick={() => setShowRecipe(null)}> <div className="modal-content p-0 overflow-hidden" onClick={(e) => e.stopPropagation()}> <RecipeCard id={showRecipe.id} nome={showRecipe.nome} descricao={showRecipe.descricao} preco={showRecipe.preco} categoria={showRecipe.categoria} inCart={isInCart(showRecipe.id)} onAdd={() => handleRecipeAdd(showRecipe)} onReject={handleRecipeReject} /> </div> </div> )} {foundRecipes.length > 0 && ( <div className="mb-8"> <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "'Fredoka One', cursive", color: "#FF6B35" }}> Receitas Adicionadas </h2> <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"> {foundRecipes.map((recipe) => ( <RecipeCard key={recipe.id} id={recipe.id} nome={recipe.nome} descricao={recipe.descricao} preco={recipe.preco} categoria={recipe.categoria} inCart={isInCart(recipe.id)} onAdd={() => handleRecipeAdd(recipe)} onReject={handleRecipeReject} /> ))} </div> </div> )} </section> <div className="max-w-6xl mx-auto px-4 my-8"> <div className="gradient-store rounded-3xl px-6 py-10 sm:py-14 text-center text-white mb-6" style={{ minHeight: "160px" }}> <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ fontFamily: "'Fredoka One', cursive" }}> 🏪 Loja AmiguMundo </h1> <p className="text-white/80 text-sm sm:text-base">Explore nossa colecao completa de receitas e produtos</p> </div> <div className="h-6 gradient-redline mb-8" /> </div> <section className="max-w-6xl mx-auto px-4"> <div className="mb-10"> <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Fredoka One', cursive", color: "#9B59B6" }}> ⭐ Produtos que Vao Transformar sua Arte </h2> <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"> {upsells.map((upsell) => ( <UpsellCard key={upsell.id} upsell={upsell} onOpen={() => setActiveUpsell(upsell.id)} /> ))} </div> </div> {activeUpsell && ( <UpsellModal upsell={upsells.find((u) => u.id === activeUpsell)!} onClose={() => setActiveUpsell(null)} onBuy={handleUpsellBuy} /> )} <div className="mb-10"> <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Fredoka One', cursive", color: "#7BC843" }}> 🧶 Categorias de Receitas </h2> <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"> {categories.map((cat) => ( <CategoryCard key={cat} nome={cat} /> ))} </div> </div> <div className="mb-10"> <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Fredoka One', cursive", color: "#FF6B35" }}> 📦 Packs Tematicos </h2> <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"> {packs.map((pack) => ( <PackCard key={pack.id} pack={pack} inCart={isInCart(pack.id)} onAdd={() => handlePackAdd(pack.id)} onRemove={() => handlePackRemove(pack.id)} /> ))} </div> </div> <div className="mb-10"> <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Fredoka One', cursive", color: "#F5A623" }}> 👑 Combos Elite — Volume com Desconto </h2> <div className="max-w-2xl mx-auto space-y-4"> {combos.map((combo) => ( <ComboCard key={combo.id} combo={combo} inCart={isInCart(combo.id)} onAdd={() => handleComboAdd(combo.id)} onRemove={() => handleComboRemove(combo.id)} /> ))} </div> </div> </section> <footer className="text-center py-8 px-4"> <p className="text-sm text-gray-400">© 2024 AmiguMundo Artes — Todos os direitos reservados</p> <p className="text-xs text-gray-300 mt-1">Feito com ❤️ para artesãs brasileiras</p> </footer> <Cart count={cart.length} total={total} onCheckout={() => setShowCheckout(true)} /> {showCheckout && ( <CheckoutModal total={total} onClose={() => setShowCheckout(false)} onConfirm={() => { setShowCheckout(false); setCart([]); }} /> )} </div> ); } ＜/dyad-file>

We need to modify the two RecipeCard usages.

Let's rewrite the relevant parts:

- For showRecipe modal:

Replace:

<RecipeCard id={showRecipe.id} nome={showRecipe.nome} descricao={showRecipe.descricao} preco={showRecipe.preco} categoria={showRecipe.categoria} inCart={isInCart(showRecipe.id)} onAdd={() => handleRecipeAdd(showRecipe)} onReject={handleRecipeReject} />

with:

<RecipeCard recipe={showRecipe} onAdd={() => handleRecipeAdd(showRecipe)} onReject={handleRecipeReject} isInCart={isInCart(showRecipe.id)} />

- For foundRecipes map:

Replace:

<RecipeCard key={recipe.id} id={recipe.id} nome={recipe.nome} descricao={recipe.descricao} preco={recipe.preco} categoria={recipe.categoria} inCart={isInCart(recipe.id)} onAdd={() => handleRecipeAdd(recipe)} onReject={handleRecipeReject} />

with:

<RecipeCard key={recipe.id} recipe={recipe} onAdd={() => handleRecipeAdd(recipe)} onReject={handleRecipeReject} isInCart={isInCart(recipe.id)} />

Now we need to ensure that the component's props are updated accordingly (we already changed RecipeCard to accept recipe object). Also need to ensure that the component's interface now expects 'recipe' instead of separate fields, and also expects 'onAdd', 'onReject', 'isInCart'.

Now we need to update the RecipeCard file as described.

Now produce the final answer with the two ＜dyad-write> tags.

Also need to ensure we close the tags properly.

Let's craft the final answer.
</think><dyad-write path="src/components/RecipeCard.tsx" description="Fix RecipeCard to accept a recipe object and remove duplicate imports">
import React from "react";
interface RecipeCardProps {
  recipe: {
    id: string;
    nome: string;
    descricao: string;
    preco: number;
    categoria: string;
  };
  onAdd: () => void;
  onReject: () => void;
  isInCart: boolean;
}
const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onAdd, onReject, isInCart }) => {
  const { id, nome, descricao, preco, categoria } = recipe;
  return (
    <div style={{ background: "white", borderRadius: 20, boxShadow: "0 8px 32px rgba(0,0,0,0.13)", padding: 0, overflow: "hidden", maxWidth: 320 }}>
      <img
        src={`https://picsum.photos/seed/${id}/300/200`}
        alt={nome}
        style={{ width: "100%", height: 180, objectFit: "cover" }}
      />
      <div style={{ padding: 16 }}>
        <span
          style={{
            background: "#FF6B35",
            color: "white",
            borderRadius: 50,
            padding: "4px 12px",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          #{id}
        </span>
        <span
          style={{
            background: "#9B59B6",
            color: "white",
            borderRadius: 50,
            padding: "4px 12px",
            fontSize: 11,
            fontWeight: 600,
            marginLeft: 8,
          }}
        >
          {categoria}
        </span>
        <h3 style={{ margin: "12px 0 4px", fontSize: 18 }}>{nome}</h3>
        <p style={{ color: "#666", fontSize: 14, margin: "0 0 12px" }}>{descricao}</p>
        <p style={{ color: "#7BC843", fontSize: 22, fontWeight: 700, margin: "0 0 12px" }}>
          R$ {preco.toFixed(2)}
        </p>
        {isInCart ? (
          <span style={{ color: "green", fontWeight: 700 }}>✓ No carrinho</span>
        ) : (
          <>
            <button
              onClick={onAdd}
              style={{
                width: "100%",
                background: "#7BC843",
                color: "white",
                border: "none",
                borderRadius: 12,
                padding: "12px",
                fontWeight: 700,
                cursor: "pointer",
                marginBottom: 8,
              }}
            >
              + Adicionar ao Carrinho
            </button>
            <button
              onClick={onReject}
              style={{
                width: "100%",
                background: "#ff5252",
                color: "white",
                border: "none",
                borderRadius: 10,
                padding: "8px",
                cursor: "pointer",
              }}
            >
              ✕ Rejeitar
            </button>
          </>
        )}
      </div>
    </div>
  );
};
export default RecipeCard;