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
    <div
      style={{
        background: "white",
        borderRadius: 20,
        boxShadow: "0 8px 32px rgba(0,0,0,0.13)",
        padding: 0,
        overflow: "hidden",
        maxWidth: 320,
      }}
    >
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