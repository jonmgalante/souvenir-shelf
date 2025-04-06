
// src/context/souvenir/SouvenirProvider.tsx
import React, { useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/context/auth";
import { toast } from "@/components/ui/use-toast";
import { Souvenir } from "../../types/souvenir";
import { mockSouvenirs } from "../../data/mockData";
import {
  loadSouvenirs,
  addSouvenirAction,
  updateSouvenirAction,
  deleteSouvenirAction,
} from "./souvenirActions";

type SouvenirProviderProps = {
  children: ReactNode;
  tripsContext: {
    trips: any;
  };
  onReady?: (data: {
    souvenirs: Souvenir[];
    loading: boolean;
    addSouvenir: (souvenir: Omit<Souvenir, "id" | "userId">) => Promise<void>;
    updateSouvenir: (id: string, updates: Partial<Souvenir>) => Promise<void>;
    deleteSouvenir: (id: string) => Promise<void>;
    getSouvenirById: (id: string) => Souvenir | undefined;
  }) => void;
};

export const SouvenirProvider: React.FC<SouvenirProviderProps> = ({
  children,
  tripsContext,
  onReady,
}) => {
  const { user } = useAuth();
  const [souvenirs, setSouvenirs] = useState<Souvenir[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      if (!user) {
        if (process.env.NODE_ENV === "development") {
          setSouvenirs(mockSouvenirs);
        } else {
          setSouvenirs([]);
        }
        setLoading(false);
        return;
      }

      try {
        const fetchedSouvenirs = await loadSouvenirs(user.id);
        setSouvenirs(fetchedSouvenirs);
      } catch (error) {
        console.error("Error fetching souvenirs:", error);
        toast({
          title: "Failed to load souvenirs",
          description: "Please try again later",
          variant: "destructive",
        });

        if (process.env.NODE_ENV === "development") {
          setSouvenirs(mockSouvenirs);
        } else {
          setSouvenirs([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const addSouvenir = async (souvenir: Omit<Souvenir, "id" | "userId">) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add souvenirs",
        variant: "destructive",
      });
      return Promise.reject(new Error("Authentication required"));
    }
    try {
      const newSouvenir = await addSouvenirAction(user.id, souvenir);
      setSouvenirs((prev) => [newSouvenir, ...prev]);
    } catch (error) {
      throw error;
    }
  };

  const updateSouvenir = async (id: string, updates: Partial<Souvenir>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to update souvenirs",
        variant: "destructive",
      });
      return;
    }
    try {
      const updatedSouvenir = await updateSouvenirAction(id, updates);
      setSouvenirs((prev) =>
        prev.map((s) => (s.id === id ? updatedSouvenir : s))
      );
    } catch (error) {
      throw error;
    }
  };

  const deleteSouvenir = async (id: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to delete souvenirs",
        variant: "destructive",
      });
      return;
    }
    try {
      await deleteSouvenirAction(id);
      setSouvenirs((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      throw error;
    }
  };

  const getSouvenirById = (id: string) => {
    return souvenirs.find((s) => s.id === id);
  };

  // Notify parent of changes so it can merge data
  useEffect(() => {
    if (onReady) {
      onReady({
        souvenirs,
        loading,
        addSouvenir,
        updateSouvenir,
        deleteSouvenir,
        getSouvenirById,
      });
    }
  }, [souvenirs, loading, onReady]);

  return <>{children}</>;
};

export default SouvenirProvider;
