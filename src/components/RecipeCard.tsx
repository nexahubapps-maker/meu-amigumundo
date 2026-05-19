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
    <div className="card-float overflow-hidden relative flex flex-col bg-white">
      <div className="relative h-[120px] w-full">
        <img
          src={`https://picsum.photos/seed/${recipe.id}/400/300`}
          alt={recipe.nome}
          className="w-full h-full object-cover rounded-t-[12px]"
        />
        <div className="absolute top-1.5 left-1.5 bg-[#FF6B35] text-white text-[8px] font-bold px-2 py-0.5 rounded-full shadow-md">
          CÓD: {recipe.id}
        </div>
      </div>
      <div className="p-2 flex flex-col gap-1.5">
        <h3 className="text-gray-800 text-[0.9rem] font-bold leading-tight truncate">{recipe.nome}</h3>
        <div className="flex items-center justify-between">
          <span className="text-[#4CAF50] font-bold text-[1rem]">R$ {recipe.preco.toFixed(2)}</span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={onAdd}
            disabled={isInCart}
            className="flex-1 btn-premium bg-[#7BC843] text-white py-1.5 text-[0.75rem]"
          >
            {isInCart ? "✓ No Carrinho" : "+ Adicionar"}
          </button>
          {!isInCart && (
            <button
              onClick={onReject}
              className="px-2 py-1.5 rounded-full bg-red-50 text-red-500 text-[0.7rem] font-bold"
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