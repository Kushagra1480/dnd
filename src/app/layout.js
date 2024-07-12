import React from 'react'

export default function Layout({ children }) {
  return (
    <div className = "layout">
      <header>dnd</header>
      <main>{children}</main>
    </div>
  );
}
