import { useState, useEffect, ReactPortal, ReactNode } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { HintCard } from './HintCard';
import { useQuestionContext } from '@/providers/QuestionProvider';
import axios from 'axios';

interface HintsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}


export function HintsDrawer({ open, onOpenChange }: HintsDrawerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const { title, description, inputDescription, outputDescription, hints, setHints, ongoing } = useQuestionContext();
  const [revealedHints, setRevealedHints] = useState<Record<number, boolean>>({});

  const handleReveal = (level: number) => {
    setRevealedHints((prev) => ({ ...prev, [level]: true }));
  };
  

  useEffect(() => {

    const getHints = async (title: string | null, description: string | null, inputDescription: string | null, outputDescription: string | null) => {
      //API FETCH
      if(!title || !description ) return;

      try {
        setIsLoading(true);

        const res = await axios.post("/api/generator", {
          title,
          description,
          inputDescription,
          outputDescription
        });

        setHints(res.data?.hints);

      }catch (error) {
        console.error("Error getting from generator:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (open && !hints && !ongoing) {
      getHints(title,description,inputDescription,outputDescription);
      // setIsLoading(true);
      // // Simulate API fetch delay
      // const timer = setTimeout(() => {
      //   setIsLoading(false);
      // }, 1500);
      // setHints([]);
      // return () => clearTimeout(timer);
    }

    
  }, [open]);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent >
        <DrawerHeader className="text-center">
          <DrawerTitle>Hints</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {(isLoading ? Array(3).fill(null) : hints)?.map((_hint, index) => {
              const level = Number(_hint?.level ?? index + 1);

              return (
                <HintCard
                key={index}
                level={_hint?.level || 0}
                content={_hint?.hint || ''}
                isLoading={isLoading}
                ongoing={ongoing}
                isRevealed={revealedHints[level] ?? false}
                onReveal={() => handleReveal(level)}
              />
              )
            })}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}