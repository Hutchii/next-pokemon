import Link from "next/link";

const Header = () => {
  return (
    <header className="text-md sm:text-lg h-20 px-5 sm:px-10 2xl:px-20 4xl:px-40 mx-auto text-md font-semibold">
      <nav className="flex items-center justify-between h-full">
        <Link href="/">
          <a className="font-bold uppercase text-fuchsia-500">Pokemon</a>
        </Link>
        <ul className="flex items-center gap-10">
          <Link href="/results">
            <a>
              <li>Results</li>
            </a>
          </Link>
          <Link href="/pokedex">
            <a>
              <li>Pokedex</li>
            </a>
          </Link>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
