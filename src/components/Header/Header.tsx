import Link from "next/link";

const Header = () => {
  return (
    <header className="h-20 px-40 mx-auto text-md font-semibold">
      <nav className="flex items-center justify-between h-full">
        <p>Logo</p>
        <ul className="flex items-center gap-12">
          {/* <li className="text-fuchsia-600">Sign in</li> */}
          <Link href="/">
            <a>
              <li>Vote</li>
            </a>
          </Link>
          <Link href="/results">
            <a>
              <li>Results</li>
            </a>
          </Link>
          {/* <li>Pokedex</li>
          <li>About</li> */}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
