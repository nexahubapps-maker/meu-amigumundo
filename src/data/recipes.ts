export interface Recipe {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
}

export const recipes: Recipe[] = [
  { id: "3872", nome: "Unicórnio Pastel", descricao: "Crina arco-íris e chifre dourado. Encanta crianças.", preco: 8.90, categoria: "Fantasia" },
  { id: "1204", nome: "Coelhinho Apaixonado", descricao: "Perfeito para o Dia dos Namorados e festas.", preco: 6.90, categoria: "Animais" },
  { id: "5531", nome: "Gatinho Soneca", descricao: "Gatinho com olhinhos fechados e bocejo fofo.", preco: 6.50, categoria: "Animais" },
  { id: "7743", nome: "Dinossauro Baby", descricao: "Dino verde com barriguinha redonda e expressão simpática.", preco: 7.50, categoria: "Fantasia" },
  { id: "2290", nome: "Polvinho Reversível", descricao: "Polvo com duas faces: feliz e bravo. Sucesso garantido.", preco: 7.90, categoria: "Mar" },
  { id: "4418", nome: "Mini Ursinho Pocket", descricao: "Ursinho pequenininho, cabe no bolso. Ultra fofo.", preco: 5.90, categoria: "Animais" },
  { id: "6605", nome: "Princesa Aurora", descricao: "Vestido rosa com coroa dourada. Para fãs de contos de fada.", preco: 9.90, categoria: "Princesas" },
  { id: "8821", nome: "Super-Herói Azul", descricao: "Amigurumi de super-herói com capa e símbolo no peito.", preco: 8.50, categoria: "Super-Heróis" },
  { id: "3310", nome: "Bebê Soninho", descricao: "Bebê dormindo com travesseirinho. Presente perfeito.", preco: 7.00, categoria: "Bebês" },
  { id: "9934", nome: "Papai Noel Gorducho", descricao: "Noel com barriga, barba e saquinho de presentes.", preco: 10.90, categoria: "Natal" },
  { id: "1177", nome: "Moranguinho Doce", descricao: "Frutinha vermelha com folhinhas verdes. Fofa demais.", preco: 5.50, categoria: "Frutas" },
  { id: "4499", nome: "Abacaxi Tropical", descricao: "Amigurumi de abacaxi sorridente. Decoração tropical.", preco: 6.00, categoria: "Frutas" },
];