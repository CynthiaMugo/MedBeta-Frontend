import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="flex justify-between items-center px-8 py-4 bg-white shadow-md">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        MedBeta
      </Link>
      <nav className="flex gap-6">
        <Link to="/" className="hover:text-blue-500 transition">Home</Link>
        <a href="/#about">About</a>
        <a href="/#contact">Contact</a>
      </nav>
    </header>
  );
};

export default Header;
