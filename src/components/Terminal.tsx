import React, { useEffect, useRef } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';

const Terminal: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    // Initialize xterm
    const term = new XTerm({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'JetBrains Mono, monospace',
      theme: {
        background: '#000000CC',
        foreground: '#ffffff',
        cursor: '#ffffff',
        cursorAccent: '#000000',
        selection: 'rgba(255, 255, 255, 0.3)',
      },
      allowTransparency: true,
    });

    // Add addons
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.loadAddon(new WebLinksAddon());

    // Open terminal
    term.open(terminalRef.current);
    fitAddon.fit();

    // Write welcome message
    term.writeln('\x1b[1;36mWelcome to the Terminal\x1b[0m');
    term.writeln('Type \x1b[1;33mhelp\x1b[0m for available commands\n');

    // Store terminal instance
    xtermRef.current = term;

    // Handle input
    let currentLine = '';
    const history: string[] = [];
    let historyIndex = 0;

    term.onKey(({ key, domEvent }) => {
      const ev = domEvent as KeyboardEvent;
      
      // Handle special keys
      if (ev.keyCode === 13) { // Enter
        term.write('\r\n');
        handleCommand(currentLine);
        history.push(currentLine);
        historyIndex = history.length;
        currentLine = '';
      } else if (ev.keyCode === 8) { // Backspace
        if (currentLine.length > 0) {
          currentLine = currentLine.slice(0, -1);
          term.write('\b \b');
        }
      } else if (ev.keyCode === 38) { // Up arrow
        if (historyIndex > 0) {
          historyIndex--;
          clearCurrentLine();
          currentLine = history[historyIndex];
          term.write(currentLine);
        }
      } else if (ev.keyCode === 40) { // Down arrow
        clearCurrentLine();
        if (historyIndex < history.length - 1) {
          historyIndex++;
          currentLine = history[historyIndex];
          term.write(currentLine);
        } else {
          historyIndex = history.length;
          currentLine = '';
        }
      } else if (!ev.altKey && !ev.ctrlKey && !ev.metaKey) {
        currentLine += key;
        term.write(key);
      }
    });

    // Handle window resize
    const handleResize = () => {
      fitAddon.fit();
    };

    window.addEventListener('resize', handleResize);

    // Command handler
    const handleCommand = (command: string) => {
      const cmd = command.trim().toLowerCase();
      
      if (cmd === 'help') {
        term.writeln('\r\nAvailable commands:');
        term.writeln('  help     - Show this help message');
        term.writeln('  clear    - Clear the terminal');
        term.writeln('  echo     - Echo a message');
        term.writeln('  date     - Show current date and time\n');
      } else if (cmd === 'clear') {
        term.clear();
      } else if (cmd.startsWith('echo ')) {
        term.writeln(command.slice(5));
      } else if (cmd === 'date') {
        term.writeln(new Date().toLocaleString());
      } else if (cmd !== '') {
        term.writeln(`Command not found: ${command}`);
      }

      term.write('\x1b[1;32m$\x1b[0m ');
    };

    // Helper to clear current line
    const clearCurrentLine = () => {
      term.write('\r\x1b[K');
      term.write('\x1b[1;32m$\x1b[0m ');
    };

    // Initial prompt
    term.write('\x1b[1;32m$\x1b[0m ');

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
    };
  }, []);

  return (
    <div className="terminal-container w-full h-[500px]">
      <div ref={terminalRef} className="h-full" />
    </div>
  );
};

export default Terminal;