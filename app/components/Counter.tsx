"use client";

import { increment } from "@/lib/features/counter/counterSlice";
import { RootState } from "@/lib/store";
import { useDispatch, useSelector } from "react-redux";

const Counter = () => {
  const counter = useSelector<RootState, number>(
    (state) => state.counter.value
  );
  const dispatch = useDispatch();

  return (
    <div>
      <p>You clicked {counter} times</p>
      <button onClick={() => dispatch(increment())}>Click me</button>
    </div>
  );
};

export default Counter;
