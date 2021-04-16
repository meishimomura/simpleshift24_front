import React from "react";
import { useSelector, useDispatch } from "react-redux";

import ShiftForm from "./ShiftForm";
import ShiftList from "./ShiftList";
import ShiftDisplay from "./ShiftDisplay";
import { selectEditedShift } from "./shiftSlice";

import { AppDispatch } from "../../app/store";

const Shift: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const editedShift = useSelector(selectEditedShift);
  return (
    <>
      <ShiftList />
      {editedShift.staff ? <ShiftForm /> : <ShiftDisplay />}
    </>
  );
};

export default Shift;
