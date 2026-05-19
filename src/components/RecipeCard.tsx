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
    <div className="neo-card overflow-hidden relative flex flex-col bg-white">
      <div className="relative h-[120px] w-full border-b-2 border-[#171717]">
        <img
          src={`https://picsum.photos/seed/${recipe.id}/400/300`}
          alt={recipe.nome}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2 bg-[#F8DD12] text-[#171717] text-[9px] font-black px-2 py-1 border-2 border-[#171717] rounded-[4px]">
          CÓD: {recipe.id}
        </div>
      </div>
      <div className="p-3 flex flex-col gap-2">
        <h3 className="text-[#171717] text-[0.9rem] font-black leading-tight truncate uppercase">{recipe.nome}</h3>
        <span className="text-[#171717] font-black text-[1.1rem]">R$ {recipe.preco.toFixed(2)}</span>
        
        <div className="flex gap-2">
          <button
            onClick={onAdd}
            disabled={isInCart}
            className={`flex-1 py-2 text-[0.75rem] ${isInCart ? 'bg-gray-100 text-gray-400 border-gray-300' : 'neo-btn-buy'}`}
          >
            {isInCart ? "✓ NO CARRINHO" : "+ ADICIONAR"}
          </button>
          {!isInCart && (
            <button
              onClick={onReject}
              className="px-3 py-2 bg-white border-2 border-[#171717] rounded-[8px] text-[#171717] font-black text-[0.8rem] hover:bg-red-50"
              style={{ boxShadow: '2px 2px 0px 0px #171717' }}
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