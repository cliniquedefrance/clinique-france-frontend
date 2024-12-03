import React from "react"
import { useCashOperation } from "./CashOperationZone";

function CashOperationNumber() {
    const { totalOperations } = useCashOperation();
    return <div>{totalOperations} opérations trouvées</div>;
  }

  export default CashOperationNumber;