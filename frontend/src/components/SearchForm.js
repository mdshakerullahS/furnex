"use client";

import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { useForm } from "react-hook-form";
import useProducts from "@/stores/productStore";
import { usePathname, useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";

const SearchForm = () => {
  const { setSearch } = useProducts();

  const router = useRouter();
  const pathname = usePathname();

  const { handleSubmit, register } = useForm();

  const onSubmit = (data) => {
    setSearch(data.search);

    if (pathname !== "/shop") router.push("/shop");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputGroup className="rounded-xl overflow-hidden">
        <InputGroupInput
          placeholder="Search Products . . ."
          {...register("search")}
        />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
};

export default SearchForm;
