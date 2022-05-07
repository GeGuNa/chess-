import { useEffect, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import pgn from "./pgn/example_pgn.pgn?raw";

var wasmSupported =
  typeof WebAssembly === "object" &&
  WebAssembly.validate(
    Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00)
  );

var stockfish = new Worker(
  !wasmSupported ? "src/stockfish.wasm.js" : "src/stockfish.js"
);

stockfish.addEventListener("message", function (e) {
  console.log(e.data);

  const a: String = e.data;

  if (a.startsWith("bestmove")) {
    console.log(a.split("bestmove"));
  }
});

stockfish.postMessage("uci");

//stockfish.postMessage("position fen r3k3/1R1ppp2/8/8/8/8/8/1Q2K3 w - - 0 1");
stockfish.postMessage("position fen 1r2k3/8/8/8/8/8/3PPPPP/4K2R w K - 0 1");
stockfish.postMessage("go depth 10");

const PlayRandomMoveEngine = () => {
  const [game, setGame] = useState(new Chess());
  const [undoCount, setUndoCount] = useState(0);
  let [initialMoves, setInitialMoves] = useState([] as any);

  useEffect(() => {
    game.load_pgn(pgn);
    setInitialMoves(game.history());
  }, []);

  return (
    <>
      <button
        disabled={undoCount === initialMoves.length}
        onClick={() => {
          game.undo();
          setUndoCount(undoCount + 1);
        }}
      >
        Voltar
      </button>
      <button
        disabled={undoCount === 0}
        onClick={() => {
          game.move(initialMoves[initialMoves.length - undoCount]);
          setUndoCount(undoCount - 1);
        }}
      >
        Avançar
      </button>
      <Chessboard position={game.fen()} />
    </>
  );
};

export default PlayRandomMoveEngine;