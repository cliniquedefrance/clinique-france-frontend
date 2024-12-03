import { Alert, AlertDescription, AlertIcon, AlertTitle, Button, Spinner } from "@chakra-ui/react";
import React, { useEffect } from "react";

export default function CashOperationState({ process, retryFunction, setProcess }) {
    const { error, success, loading } = process;
  
    // eslint-disable-next-line consistent-return
    useEffect(() => {
      if (success && setProcess) {
        const timer = setTimeout(() => {
          setProcess(prev => ({...prev, success:null}))
        }, 2000);
        return () => clearTimeout(timer);
      }
    }, [success, process]);
  
    return (
      <div>
        {loading && <Spinner />}
        {error && (
          <Alert status="error" variant="left-accent" mb={4}>
            <AlertIcon />
            <AlertTitle mr={2}>Erreur!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            <Button onClick={retryFunction} ml={4} colorScheme="red">
              Réessayer
            </Button>
          </Alert>
        )}
        {success && (
          <Alert status="success" variant="left-accent" mb={4}>
            <AlertIcon />
            <AlertTitle mr={2}>Succès!</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
      </div>
    );
  }