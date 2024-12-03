import React from "react";
import { IconButton } from "@chakra-ui/react";
import { LuRefreshCcw } from "react-icons/lu";
import { useCashOperation } from "./CashOperationZone";

function CashOperationRefresh() {
    const { refreshOperations } = useCashOperation();
    return <IconButton onClick={refreshOperations} aria-label='Actualiser'>
      <LuRefreshCcw />
    </IconButton>
  }

  export default CashOperationRefresh;