import Image from "next/image";
import { useState } from "react";

const PokemonImage = ({ image }: { image: string }): JSX.Element => {
  const [startAnimation, setStartAnimation] = useState(false);
  return (
    <Image
      src={image}
      alt="Pokemon"
      width={256}
      height={256}
      quality={90}
      className={`opacity-0 ${startAnimation && "animate-fade-in"}`}
      onLoadingComplete={() => setStartAnimation(true)}
    />
  );
};

export default PokemonImage;
