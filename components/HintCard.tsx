import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface HintCardProps {
  level: number;
  content: string;
  isLoading?: boolean;
  ongoing?: boolean;
  isRevealed?: boolean;
  onReveal?: () => void;
}

export function HintCard({ level, content, isLoading, ongoing, isRevealed, onReveal }: HintCardProps) {

  if (isLoading) {
    return (
      <Card className="w-full animate-pulse">
        <CardHeader>
          <div className="h-7 w-24 bg-muted rounded-md"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded-md w-3/4"></div>
            <div className="h-4 bg-muted rounded-md w-full"></div>
            <div className="h-4 bg-muted rounded-md w-2/3"></div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="h-10 w-24 bg-muted rounded-md"></div>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Hint {level}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={cn(
          "transition-all duration-500",
          !isRevealed && "blur-sm select-none"
        )}>
          {content}
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onReveal} 
          disabled={isRevealed}
          variant={isRevealed ? "secondary" : "default"}
        >
          {isRevealed ? "Revealed" : "Reveal Hint"}
        </Button>
      </CardFooter>
    </Card>
  );
}