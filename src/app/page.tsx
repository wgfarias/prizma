import Link from "next/link";

export default function HomePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
      }}
    >
      <h1 style={{ fontSize: "2rem", fontWeight: 600, margin: 0 }}>Prizma</h1>
      <p style={{ color: "#666", margin: 0 }}>BPO e Contabilidade</p>
      <div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
        <Link
          href="/login"
          style={{
            textDecoration: "none",
            padding: "8px 20px",
            backgroundColor: "#1976d2",
            color: "#fff",
            borderRadius: "4px",
            fontWeight: 500,
          }}
        >
          Entrar
        </Link>
        <Link
          href="/cadastro"
          style={{
            textDecoration: "none",
            padding: "8px 20px",
            border: "1px solid #1976d2",
            color: "#1976d2",
            borderRadius: "4px",
            fontWeight: 500,
          }}
        >
          Cadastrar escritório
        </Link>
      </div>
    </div>
  );
}
