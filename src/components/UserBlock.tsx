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
    <div className="my-4">
      <p className="mb-5 font-semibold">Register Game:</p>

      <form
        onSubmit={handleSubmit}
        className="bg-slate-100 rounded-lg shadow p-3 grow max-w-[300px] flex flex-col gap-3 my-5"
      >
        <label>
          <small>Player name</small>
          <input
            className="input outline-none focus:outline-none"
            value={userData.name}
            onChange={(e) => handleChange("name", e.target.value.trim())}
            required
          />
        </label>
        <label className="flex flex-col gap-1">
          <small>Complexity</small>
          <select
            className="input outline-none focus:outline-none"
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

        <button className="btn">Ready</button>
      </form>
    </div>
  );
};

export default UserBlock;
