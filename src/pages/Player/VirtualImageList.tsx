import * as React from "react";
import { createRoot } from "react-dom/client";

import { useVirtualizer, useWindowVirtualizer } from "@tanstack/react-virtual";
import { IFile } from "@/types";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { usePlayerStore } from "@/store/playerStore";

// import "./index.css";

// function RowVirtualizerDynamic() {
//   const parentRef = React.useRef<HTMLDivElement>(null);

//   const count = sentences.length;
//   const virtualizer = useVirtualizer({
//     count,
//     getScrollElement: () => parentRef.current,
//     estimateSize: () => 45,
//   });

//   const items = virtualizer.getVirtualItems();

//   return (
//     <div>
//       <button
//         onClick={() => {
//           virtualizer.scrollToIndex(0);
//         }}
//       >
//         scroll to the top
//       </button>
//       <span style={{ padding: "0 4px" }} />
//       <button
//         onClick={() => {
//           virtualizer.scrollToIndex(count / 2);
//         }}
//       >
//         scroll to the middle
//       </button>
//       <span style={{ padding: "0 4px" }} />
//       <button
//         onClick={() => {
//           virtualizer.scrollToIndex(count - 1);
//         }}
//       >
//         scroll to the end
//       </button>
//       <hr />
//       <div
//         ref={parentRef}
//         className="List"
//         style={{
//           height: 400,
//           width: 400,
//           overflowY: "auto",
//           contain: "strict",
//         }}
//       >
//         <div
//           style={{
//             height: virtualizer.getTotalSize(),
//             width: "100%",
//             position: "relative",
//           }}
//         >
//           <div
//             style={{
//               position: "absolute",
//               top: 0,
//               left: 0,
//               width: "100%",
//               transform: `translateY(${items[0].start}px)`,
//             }}
//           >
//             {items.map((virtualRow) => (
//               <div
//                 key={virtualRow.key}
//                 data-index={virtualRow.index}
//                 ref={virtualizer.measureElement}
//                 className={
//                   virtualRow.index % 2 ? "ListItemOdd" : "ListItemEven"
//                 }
//               >
//                 <div style={{ padding: "10px 0" }}>
//                   <div>Row {virtualRow.index}</div>
//                   <div>{sentences[virtualRow.index]}</div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

export const RowVirtualizerDynamicWindow = ({ files }: { files: IFile[] }) => {
  const parentRef = React.useRef<HTMLDivElement>(null);
  const index = usePlayerStore((state) => state.index);

  const parentOffsetRef = React.useRef(0);

  React.useLayoutEffect(() => {
    parentOffsetRef.current = parentRef.current?.offsetTop ?? 0;
  }, []);

  const virtualizer = useWindowVirtualizer({
    count: files.length,
    overscan: 5,
    estimateSize: React.useCallback(() => 400, []),
    scrollMargin: parentOffsetRef.current,
  });

  const items = virtualizer.getVirtualItems();

  React.useEffect(() => {
    virtualizer.scrollToIndex(index);
  }, [index]);

  return (
    <div ref={parentRef}>
      <div
        style={{
          // height: virtualizer.getTotalSize(),
          height: "100vh",
          width: "100%",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            height: "100vh",
            left: 0,
            width: "100%",
            transform: `translateY(${
              items[0].start - virtualizer.options.scrollMargin
            }px)`,
          }}
        >
          {items.map((virtualRow) => (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
            >
              <div className="h-screen">
                <img
                  className="h-full max-w-full object-contain"
                  src={convertFileSrc(files[virtualRow.index].path)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// function ColumnVirtualizerDynamic() {
//   const parentRef = React.useRef<HTMLDivElement | null>(null);

//   const virtualizer = useVirtualizer({
//     horizontal: true,
//     count: sentences.length,
//     getScrollElement: () => parentRef.current,
//     estimateSize: () => 45,
//   });

//   return (
//     <>
//       <div
//         ref={parentRef}
//         className="List"
//         style={{ width: 400, height: 400, overflowY: "auto" }}
//       >
//         <div
//           style={{
//             width: virtualizer.getTotalSize(),
//             height: "100%",
//             position: "relative",
//           }}
//         >
//           {virtualizer.getVirtualItems().map((virtualColumn) => (
//             <div
//               key={virtualColumn.key}
//               data-index={virtualColumn.index}
//               ref={virtualizer.measureElement}
//               className={
//                 virtualColumn.index % 2 ? "ListItemOdd" : "ListItemEven"
//               }
//               style={{
//                 position: "absolute",
//                 top: 0,
//                 left: 0,
//                 height: "100%",
//                 transform: `translateX(${virtualColumn.start}px)`,
//               }}
//             >
//               <div style={{ width: sentences[virtualColumn.index].length }}>
//                 <div>Column {virtualColumn.index}</div>
//                 <div>{sentences[virtualColumn.index]}</div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// }
