"use client";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { gameState, setUser } from "@/redux/slices/gameSlice";
import React, { FormEvent, useState } from "react";
import { COMPLEXITY, ROUTES } from "@/utils/constants";
import { useRouter } from "next/navigation";

interface IUserState {
  name: string;
  complexity: number | string;
}

const UserBlock = () => {
  const dispatch = useAppDispatch();
  const { push } = useRouter();
  const { user } = useAppSelector(gameState);

  const [userData, setUserData] = useState<IUserState>({
    name: "",
    complexity: 0,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const { name, complexity } = userData;
    dispatch(setUser({ ...user, name, complexity }));
    push(ROUTES.game);
  };

  const handleChange = (name: string, value: string | number) => {
    setUserData((state) => ({ ...state, [name]: value }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grow max-w-[300px] flex flex-col gap-3 my-5"
    >
      <p className="mb-5">Register Game:</p>
      <label>
        <small>Player name</small>
        <input
          className="border-b w-full outiline-none focus: outline-none"
          value={userData.name}
          onChange={(e) => handleChange("name", e.target.value.trim())}
          required
        />
      </label>
      <label className="flex flex-col gap-1">
        <small>Complexity</small>
        <select
          className="border-b w-full"
          value={userData.complexity}
          onChange={(e) => handleChange("complexity", e.target.value)}
        >
          {COMPLEXITY.map((el) => (
            <option key={el} value={el}>
              {el}
            </option>
          ))}
        </select>
      </label>

      <button className="p-3 border-2 rounded-md my-5 w-fit">Ready</button>
    </form>
  );
};

export default UserBlock;
