let alfabeto = "abcdefghijklmnopqrstuvwxyz";

// Crea una funzione che ritorna una lettera casuale
function letteraCasuale() {
  // Genera un indice casuale tra 0 e 25
  let indice = Math.floor(Math.random() * 26);
  // Ritorna la lettera corrispondente all'indice
  return alfabeto[indice];
}

// Crea una funzione che ritorna un nome casuale
function nomeCasuale() {
  // Crea una variabile per il nome
  let nome = "";
  // Genera una lunghezza casuale tra 3 e 10
  let lunghezza = Math.floor(Math.random() * 8) + 3;
  // Aggiungi una lettera casuale al nome per ogni carattere
  for (let i = 0; i < lunghezza; i++) {
    nome += letteraCasuale();
  }
  // Ritorna il nome con la prima lettera maiuscola
  return nome[0].toUpperCase() + nome.slice(1);
}

export const treeData = Array.from({ length: 10 }, (_, i) => {
  let partial = {}
  switch (i) {
    case 0:
      partial = {
        label: 'Home',
        children: buildTree(5),
        selfExpand: true,
      }
      break;
    case 1:
      partial = { label: `Folder-${0}`, children: buildTree(3) }
      break;
    default:
      partial = { label: `${nomeCasuale()}-${i}` }
      break;
  }
  return { ...partial }
});

export function buildTree(n = 0) {
  const tree = Array.from({ length: 10 }, (_, i) => {
    let partial = {}
    switch (i) {
      case 0:
        partial = { label: `Folder-${n}`, children: [] }
        if (n > 0) {
          partial.children = buildTree(n - 1)

        }
        break;
      default:
        partial = { label: `${nomeCasuale()}-${i}` }
        break;
    }
    return { ...partial }
  });
  return tree;
}