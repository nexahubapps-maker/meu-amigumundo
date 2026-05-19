"use client";

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

const RecipeCard = ({ recipe, onAdd, onReject, isInCart }: RecipeCardProps) => {
  return (
    <div className="card-float overflow-hidden relative flex flex-col">
      <div className="relative h-[140px] w-full">
        <img
          src={`https://picsum.photos/seed/${recipe.id}/400/300`}
          alt={recipe.nome}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2 bg-[#FF6B35] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md">
          R$ {recipe.preco.toFixed(2)}
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
          <h3 className="text-white text-sm font-bold leading-tight truncate">{recipe.nome}</h3>
        </div>
      </div>
      <div className="p-3 flex flex-col gap-2">
        <p className="text-gray-500 text-[10px] line-clamp-2 leading-tight">{recipe.descricao}</p>
        <div className="flex gap-2">
          <button
            onClick={onAdd}
            disabled={isInCart}
            className="flex-1 btn-premium bg-[#7BC843] text-white disabled:opacity-50"
          >
            {isInCart ? "✓ No Carrinho" : "+ Adicionar"}
          </button>
          {!isInCart && (
            <button
              onClick={onReject}
              className="px-3 py-2 rounded-full bg-red-50 text-red-500 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;