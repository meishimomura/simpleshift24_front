import React from "react";
import { useSelector, useDispatch } from "react-redux";

import ShiftList from "./ShiftList";
import { selectEditedShift } from "./shiftSlice";

import { AppDispatch } from "../../app/store";

const Shift: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const editedShift = useSelector(selectEditedShift);

  return (
    <>
      <ShiftList />
    </>
  );
};

export default Shift;
