"use client";

import { useEffect, useState } from "react";
import { useLazyGetPokemonByNameQuery } from "@/lib/apis/pokemonApi";
import { Input } from "@chakra-ui/react";

const API = () => {
  const [getPokemonByName, { data = {}, error, isLoading }, lastPromiseInfo] =
    useLazyGetPokemonByNameQuery();
  const [pokemonName, setPokemonName] = useState("");

  useEffect(() => {
    const getData = setTimeout(() => {
      if (pokemonName) getPokemonByName(pokemonName, true);
    }, 2000);

    return () => clearTimeout(getData);
  }, [pokemonName]);

  const abilities = data?.abilities?.map(
    (ability: any) => ability.ability.name
  );

  return (
    <div>
      {isLoading ? <p>Loading...</p> : null}
      {data ? <p>{pokemonName} data:</p> : null}
      {data ? <p>{JSON.stringify(abilities)}</p> : null}
      <Input
        placeholder="Type here..."
        value={pokemonName}
        onChange={(e) => setPokemonName(e.target.value)}
      />
    </div>
  );
};

export default API;
