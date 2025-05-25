"use client";
import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

// This is a specialized renderer for Codeforces problems
export function CodeforcesMathRenderer({ html, className = '' }: { html: string, className?: string }): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current || !html) return;
    
    // Get the container element
    const container = containerRef.current;
    
    // Preprocessing specific to Codeforces math formatting
    let processedHtml = html
      // First handle the triple dollar signs which appear to be delimiter issues
      .replace(/\$\$\$/g, '')
      
      // Handle Codeforces' use of *...* for emphasis within math
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      
      // Clean up any remaining problematic formatting
      .replace(/\^{\\text{∗}}/g, '^*')
      .replace(/\\text{([^}]+)}/g, '\\text{$1}');
    
    // Set the preprocessed HTML
    container.innerHTML = processedHtml;
    
    // Find all math elements after preprocessing
    const mathElements = [
      ...Array.from(container.querySelectorAll('span.tex-math')),
      ...findInlineMatches(container)
    ];
    
    // Render each math element
    mathElements.forEach(element => {
      try {
        // Get the LaTeX content
        let latex = element.textContent || '';
        
        // Clean up the LaTeX
        latex = latex.trim()
          .replace(/\*([^*]+)\*/g, '{\\text{$1}}') // Handle emphasis
          .replace(/\bto\b/g, '\\text{to}')        // Handle "to" keyword
          .replace(/\bin\b/g, '\\text{in}')        // Handle "in" keyword
          .replace(/\bis\b/g, '\\text{is}');       // Handle "is" keyword
        
        // Create a new element to hold the rendered math
        const renderedElement = document.createElement('span');
        
        // Determine if it should be display or inline mode
        const isDisplayMode = element.classList?.contains('display-math') || 
                             latex.startsWith('$$') || 
                             latex.startsWith('\\[');
        
        // Strip delimiters if present
        if (latex.startsWith('$$') && latex.endsWith('$$')) {
          latex = latex.slice(2, -2);
        } else if (latex.startsWith('$') && latex.endsWith('$')) {
          latex = latex.slice(1, -1);
        } else if (latex.startsWith('\\(') && latex.endsWith('\\)')) {
          latex = latex.slice(2, -2);
        } else if (latex.startsWith('\\[') && latex.endsWith('\\]')) {
          latex = latex.slice(2, -2);
        }
        
        // Render the LaTeX
        katex.render(latex, renderedElement, {
          displayMode: isDisplayMode,
          throwOnError: false,
          output: 'html'
        });
        
        // Replace the original element with the rendered math
        element.replaceWith(renderedElement);
      } catch (error) {
        console.error('Error rendering math:', error);
        element.classList.add('katex-error');
      }
    });
    
  }, [html]);
  
  // Helper function to find inline math delimiters in text nodes
  function findInlineMatches(container: HTMLElement): HTMLElement[] {
    const result: HTMLElement[] = [];
    const walker = document.createTreeWalker(
      container,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    // Regular expressions to find math delimiters
    const mathRegexes = [
      { regex: /\$\$(.*?)\$\$/g, isDisplay: true },
      { regex: /\$(.*?)\$/g, isDisplay: false },
      { regex: /\\\[(.*?)\\\]/g, isDisplay: true },
      { regex: /\\\((.*?)\\\)/g, isDisplay: false }
    ];
    
    let node;
    while (node = walker.nextNode()) {
      const text = node.textContent || '';
      
      // Check each regex for matches
      for (const { regex, isDisplay } of mathRegexes) {
        let match;
        regex.lastIndex = 0; // Reset regex state
        
        while ((match = regex.exec(text)) !== null) {
          // Create a span for the math content
          const span = document.createElement('span');
          span.textContent = match[0];
          if (isDisplay) {
            span.classList.add('display-math');
          } else {
            span.classList.add('inline-math');
          }
          
          // Split the text node
          const before = document.createTextNode(
            text.slice(0, match.index)
          );
          const after = document.createTextNode(
            text.slice(match.index + match[0].length)
          );
          
          // Replace the text node with the split parts
          const parent = node.parentNode;
          if (parent) {
            parent.insertBefore(before, node);
            parent.insertBefore(span, node);
            parent.insertBefore(after, node);
            parent.removeChild(node);
            
            result.push(span);
            
            // Update the walker to continue from the right position
            node = after;
            break;
          }
        }
      }
    }
    
    return result;
  }
  
  return <div ref={containerRef} className={className} />;
}