const treeContainer = document.getElementById("treeContainer");
const form = document.getElementById("familyForm");
const bioModal = document.getElementById("bioModal");
const bioTitle = document.getElementById("bioTitle");
const bioText = document.getElementById("bioText");
const closeModal = document.getElementById("closeModal");
const info = document.getElementById("info");
const navButtons = document.querySelectorAll("header nav button");

// DEFAULT TREE 7+ node, depth 3
let familyTree = JSON.parse(localStorage.getItem("familyTree")) || {
  nama: "Nabi Muhammad ﷺ",
  avatar: "assets/muhammad.jpg",
  bio: "Nabi Muhammad ﷺ lahir tahun 570 M di Mekah. Beliau adalah utusan Allah SWT dan penutup para nabi.",
  anak: [
    {
      nama: "Abdullah",
      avatar: "assets/abdullah.jpg",
      bio: "Ayah Nabi Muhammad ﷺ, wafat sebelum kelahiran beliau.",
      anak: [
        { nama: "Abd Manaf", avatar: "assets/abd manaf.jpg", bio: "Kakek Nabi Muhammad ﷺ dari garis ayah.", anak: [] },
        { nama: "Abd Shams", avatar: "assets/abd shams.jpg", bio: "Paman Nabi Muhammad ﷺ dari garis ayah.", anak: [] }
      ]
    },
    { nama: "Aminah binti Wahb", avatar: "assets/aminah.jpg", bio: "Ibu Nabi Muhammad ﷺ, wafat ketika beliau masih kecil.", anak: [] },
    { nama: "Abbas r.a", avatar: "assets/abbas.jpg", bio: "Paman Nabi Muhammad ﷺ, salah satu tokoh Quraisy.", anak: [] },
    { nama: "Al-Harith", avatar: "assets/Al-Harith.jpg", bio: "Paman Nabi Muhammad ﷺ dari pihak ayah.", anak: [] },
    { nama: "Zubayr", avatar: "assets/zubayr.jpg", bio: "Sepupu Nabi Muhammad ﷺ dari garis kakek.", anak: [] },
    { nama: "Al-Muttalib", avatar: "assets/Al-Muttalib.jpg", bio: "Kakek Nabi Muhammad ﷺ yang lain dari garis ayah.", anak: [] }
  ]
};

// Simpan ke LocalStorage
function saveTree() {
  localStorage.setItem("familyTree", JSON.stringify(familyTree));
}

// DFS cari node
function findNode(node, name) {
  if (node.nama === name) return node;
  for (let child of node.anak) {
    const found = findNode(child, name);
    if (found) return found;
  }
  return null;
}

// Hitung node & depth
function countNodes(node) {
  return 1 + node.anak.reduce((sum, c) => sum + countNodes(c), 0);
}
function getDepth(node) {
  return node.anak.length === 0 ? 1 : 1 + Math.max(...node.anak.map(getDepth));
}

// Tambah node
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const parent = document.getElementById("parent").value.trim();
  const avatar = document.getElementById("avatar").value.trim() || "assets/default-node.jpg";
  const bio = document.getElementById("bio").value.trim() || "📌 Biografi belum diisi.";
  const newNode = { nama: name, avatar, bio, anak: [] };

  if (parent) {
    const parentNode = findNode(familyTree, parent);
    if (parentNode) {
      parentNode.anak.push(newNode);
    } else {
      // Jika parent tidak ditemukan, tambahkan langsung ke root
      familyTree.anak.push(newNode);
    }
  } else {
    // Jika kosong berarti root? tapi kita sudah punya root, jadi tambahkan ke anak root
    familyTree.anak.push(newNode);
  }

  saveTree();
  renderTree();
  form.reset();
});

// Render tree
function renderTree() {
  treeContainer.innerHTML = "";
  traverse(familyTree, true);
  info.textContent = `📊 Total Node: ${countNodes(familyTree)} | 🌲 Depth: ${getDepth(familyTree)}`;
}

// Traverse & klik node → modal biografi
function traverse(node, isRoot = false) {
  const div = document.createElement("div");
  div.className = "node";
  if (isRoot) div.classList.add("root");
  else if (node.anak.length > 0) div.classList.add("parent");
  else div.classList.add("leaf");
  div.innerHTML = `<img src="${node.avatar}" alt="Avatar of ${node.nama}"><p>${node.nama}</p>`;
  treeContainer.appendChild(div);

  // klik node → modal biografi
  div.addEventListener("click", (e) => {
    e.stopPropagation();
    bioModal.classList.remove("hidden");
    bioTitle.textContent = node.nama;
    bioText.textContent = node.bio;
  });

  node.anak.forEach((child) => traverse(child));
}

// Tutup modal
closeModal.addEventListener("click", () => {
  bioModal.classList.add("hidden");
});

// Fungsi slide dan aktifkan button nav yang dipilih
const pages = document.querySelectorAll(".page");
function showPage(id) {
  pages.forEach((p) => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  // Update active button style
  navButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.textContent.trim().toLowerCase().includes(id));
  });
}

// Render awal
renderTree();
