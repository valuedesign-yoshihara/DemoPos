import React, { useState } from 'react';

interface Product {
  barcode: string;
  code: string;
  name: string;
  price: number;
}

interface CartItem extends Product {
  quantity: number;
}

const PRODUCT_MASTER: Product[] = [
  { barcode: '45286310000', code: '0823', name: '七味小袋(15g)', price: 486 },
  { barcode: '49612592510', code: '',     name: '京友禅飴',     price: 440 },
  { barcode: '45111881745', code: '0711', name: '京の閣 (1袋入り)', price: 900 },
];

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [inputVal, setInputVal] = useState<string>('');
  const [cashReceived, setCashReceived] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const change = cashReceived ? Math.max(0, Number(cashReceived) - totalPrice) : 0;

  const handleAddProduct = (product: Product) => {
    if (isLoading) return;
    setCart(prev => {
      const existing = prev.find(item => item.barcode === product.barcode);
      if (existing) {
        return prev.map(item => 
          item.barcode === product.barcode ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleSearchClick = () => {
    if (isLoading) return;
    const nextProduct = PRODUCT_MASTER[cart.length % PRODUCT_MASTER.length];
    handleAddProduct(nextProduct);
  };

  const handleAddTicket = (name: string, price: number) => {
    if (isLoading) return;
    const ticketBarcode = name === 'お茶席券(冷)' ? 'TICKET-COLD' : 'TICKET-HOT';
    handleAddProduct({ barcode: ticketBarcode, code: '----', name, price });
  };

  const updateQuantity = (barcode: string, delta: number) => {
    if (isLoading) return;
    setCart(prev => prev.map(item => {
      if (item.barcode === barcode) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeItem = (barcode: string) => {
    if (isLoading) return;
    setCart(prev => prev.filter(item => item.barcode !== barcode));
  };

  const handleCancel = () => {
    if (isLoading) return;
    setCart([]);
    setCashReceived('');
    setInputVal('');
  };

  const handleCheckout = () => {
    if (cart.length === 0 || isLoading) return;
    setIsLoading(true);
    setTimeout(() => {
      setCart([]);
      setCashReceived('');
      setInputVal('');
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="h-screen w-screen bg-[#F3EAD1] p-1.5 text-[#333333] font-sans select-none flex flex-col overflow-hidden relative">
      
      {isLoading && (
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-xl flex flex-col items-center space-y-3">
            <div className="animate-spin h-8 w-8 border-4 border-[#547394] border-t-transparent rounded-full"></div>
            <p className="text-sm font-bold text-gray-700">決済処理中...</p>
          </div>
        </div>
      )}

      {/* 1. ヘッダーエリア (固定サイズ) */}
      <div className="flex-none flex items-center justify-between mb-1">
        <div className="flex items-center space-x-3">
          <div className="bg-[#89C598] border border-black shadow-[1px_1px_0px_rgba(0,0,0,1)] px-4 py-0.5 text-base font-bold tracking-wider">
            売店 POS System
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="bg-[#EAD69E] text-center text-[10px] py-0.5 px-2 font-bold border border-black leading-none">販売</div>
            <div className="flex items-center text-xs border border-gray-400 bg-white">
              <span className="bg-[#82868A] text-white px-1.5 py-0.5 text-[10px]">担当者</span>
              <span className="px-2 py-0.5 font-bold bg-[#D3EFE0] text-[11px]">1000 | システム管理者</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="bg-[#D1D5DB] border border-gray-400 text-[#C93B3B] font-bold px-2 py-0.5 rounded shadow-sm text-[11px]">
            返品
          </button>
          <div className="flex items-center text-[10px] border border-gray-300 bg-[#E5E7EB] px-1.5 py-0.5 rounded">
            <span className="text-gray-600 mr-1">伝票日付</span>
            <span className="bg-white px-1.5 border border-gray-300 font-mono">2026/05/11</span>
          </div>
        </div>
      </div>

      {/* 2. 入力・検索バー (固定サイズ) */}
      <div className="flex-none bg-[#717375] p-1.5 flex items-center justify-between mb-1">
        <div className="flex items-center space-x-2 flex-1 max-w-2xl">
          <input 
            type="text" 
            placeholder="商品バーコード・短縮コード" 
            className="bg-[#D2F1FF] border border-gray-400 px-2 py-1 text-sm w-64 placeholder-gray-500 focus:outline-none font-mono"
            value={inputVal}
            disabled={isLoading}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputVal(e.target.value)}
          />
          <button 
            onClick={handleSearchClick}
            disabled={isLoading}
            className="bg-[#E5E7EB] hover:bg-gray-200 active:bg-gray-300 border border-gray-500 text-xs font-bold px-5 py-1 rounded shadow-sm whitespace-nowrap"
          >
            🔍 商品一覧から検索
          </button>
        </div>
        <div className="flex space-x-1">
          <button className="bg-[#E5E7EB] px-1 py-0.5 border border-gray-400 rounded text-[10px]">▲</button>
          <button className="bg-[#E5E7EB] px-1 py-0.5 border border-gray-400 rounded text-[10px]">▼</button>
        </div>
      </div>

      {/* 3. メイン明細エリア (💡ここをフレキシブル化！) */}
      {/* flex-1 で余った高さを全部使い、min-h-0 でブラウザの圧迫に合わせて絶対に縮むように指定 */}
      <div className="flex-1 bg-[#828487] p-0.5 text-xs overflow-y-auto border border-gray-600 min-h-0">
        <table className="w-full text-left border-collapse table-fixed">
          <thead className="sticky top-0 bg-[#828487] z-10 text-[10px]">
            <tr className="text-white font-bold border-b border-gray-600">
              <th className="w-[18%] p-1 text-center">バーコード</th>
              <th className="w-[10%] p-1 text-center">短縮コード</th>
              <th className="w-[34%] p-1">商品名</th>
              <th className="w-[12%] p-1 text-right">単価</th>
              <th className="w-[14%] p-1 text-center">個数</th>
              <th className="w-[12%] p-1 text-right">金額</th>
              <th className="w-[6%] p-1 text-center"></th>
            </tr>
          </thead>
          <tbody>
            {cart.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-gray-300 pt-6 text-xs">
                  商品が登録されていません。
                </td>
              </tr>
            ) : (
              cart.map((item) => (
                <tr key={item.barcode} className="bg-white border-b border-gray-300 font-bold text-gray-800 text-xs">
                  <td className="bg-[#F6D99C] border-r border-gray-300 p-1 font-mono tracking-tighter text-[10px] truncate">{item.barcode}</td>
                  <td className="border-r border-gray-300 p-1 text-center font-mono text-[11px]">{item.code}</td>
                  <td className="border-r border-gray-300 p-1 truncate text-xs">{item.name}</td>
                  <td className="border-r border-gray-300 p-1 text-right font-mono text-xs">{item.price.toLocaleString()}</td>
                  <td className="border-r border-gray-300 p-0.5 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <button onClick={() => updateQuantity(item.barcode, -1)} disabled={isLoading} className="bg-[#D1D5DB] border border-gray-400 rounded px-1 py-0.5 text-[9px] font-bold">-</button>
                      <span className="w-4 inline-block text-center font-mono text-xs">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.barcode, 1)} disabled={isLoading} className="bg-[#D1D5DB] border border-gray-400 rounded px-1 py-0.5 text-[9px] font-bold">+</button>
                    </div>
                  </td>
                  <td className="border-r border-gray-300 p-1 text-right font-mono text-xs">{(item.price * item.quantity).toLocaleString()}</td>
                  <td className="p-0.5 text-center">
                    <button onClick={() => removeItem(item.barcode)} disabled={isLoading} className="bg-[#E25C5C] text-white text-[9px] font-bold px-1 py-0.5 rounded">削除</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 4. フッター・決済エリア (💡押しやすい「元の大きさ」でガッチリ固定！) */}
      <div className="flex-none mt-1.5 grid grid-cols-12 gap-2 h-36">
        
        {/* 左 */}
        <div className="col-span-3 flex flex-col justify-between">
          <button 
            onClick={handleCancel}
            disabled={isLoading}
            className="w-full h-20 bg-gradient-to-b from-gray-100 to-gray-300 hover:from-gray-200 hover:to-gray-400 border border-gray-400 shadow-sm text-xs font-bold rounded text-gray-800 disabled:opacity-50"
          >
            キャンセル
          </button>
          <button className="w-16 h-8 bg-gradient-to-b from-gray-100 to-gray-300 border border-gray-400 shadow-sm text-[10px] font-bold rounded flex items-center justify-center">
            集計
          </button>
        </div>

        {/* 中央 */}
        <div className="col-span-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex space-x-1">
              <button className="bg-gradient-to-b from-gray-100 to-gray-300 border border-gray-400 text-[10px] font-bold px-3 py-1 rounded shadow-sm">領収書</button>
              <button className="bg-gradient-to-b from-gray-100 to-gray-300 border border-gray-400 text-[10px] font-bold px-3 py-1 rounded shadow-sm">合計表示</button>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-[10px] font-bold text-gray-700">点数：</span>
              <div className="bg-[#EEF1F6] border border-gray-300 w-12 py-0.5 px-1 text-right font-mono text-sm font-bold rounded">
                {totalItems}
              </div>
            </div>
          </div>

          {/* 金額・メーター（一番見やすい元の大きさに復活） */}
          <div className="grid grid-cols-3 gap-1.5 text-center">
            <div>
              <div className="bg-[#828487] text-white text-[9px] py-0.5 font-bold">預かり金</div>
              <input 
                type="number"
                className="w-full bg-[#D6DCFF] border border-gray-400 text-right font-mono text-lg font-bold py-0.5 px-1 focus:outline-none"
                value={cashReceived}
                placeholder="0"
                disabled={isLoading}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCashReceived(e.target.value)}
              />
            </div>
            <div>
              <div className="bg-[#828487] text-white text-[9px] py-0.5 font-bold">合計</div>
              <div className="bg-[#EEF1F6] border border-gray-400 text-right font-mono text-lg font-bold py-0.5 px-1 text-blue-700">
                {totalPrice.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="bg-[#828487] text-white text-[9px] py-0.5 font-bold">おつり</div>
              <div className="bg-[#EEF1F6] border border-gray-400 text-right font-mono text-lg font-bold py-0.5 px-1 text-red-600">
                {cashReceived ? change.toLocaleString() : 0}
              </div>
            </div>
          </div>

          {/* お茶席券も集計に合わせた h-8 のままキープ */}
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => handleAddTicket('お茶席券(冷)', 500)} disabled={isLoading} className="h-8 bg-gradient-to-b from-gray-100 to-[#E2E4E7] border-t-2 border-t-[#8DB7C7] border border-gray-400 shadow text-[10px] font-bold text-gray-700 rounded flex items-center justify-center">
              お茶席券(冷)
            </button>
            <button onClick={() => handleAddTicket('お茶席券(温)', 500)} disabled={isLoading} className="h-8 bg-gradient-to-b from-gray-100 to-[#E2E4E7] border-t-2 border-t-[#D2938E] border border-gray-400 shadow text-[10px] font-bold text-gray-700 rounded flex items-center justify-center">
              お茶席券(温)
            </button>
          </div>
        </div>

        {/* 右 */}
        <div className="col-span-3 flex flex-col justify-between space-y-1.5">
          {/* 「決定」ボタンの大きなサイズ感も完全に復元 */}
          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0 || isLoading}
            className="flex-1 bg-gradient-to-b from-white to-[#E2E3E5] hover:to-gray-300 border-2 border-[#547394] rounded flex flex-col items-center justify-center shadow-sm disabled:opacity-40"
          >
            <span className="text-sm font-bold text-gray-800 leading-none">決定</span>
            <span className="text-[10px] text-gray-600 font-bold mt-1">現金</span>
          </button>
          
          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0 || isLoading}
            className="flex-1 bg-gradient-to-b from-white to-[#E2E3E5] hover:to-gray-300 border-2 border-[#5F876E] rounded flex flex-col items-center justify-center shadow-sm disabled:opacity-40"
          >
            <span className="text-sm font-bold text-gray-800 leading-none">決定</span>
            <span className="text-[10px] text-gray-600 font-bold mt-1">クレジット</span>
          </button>

          <div className="flex space-x-1">
            <button className="flex-1 bg-gradient-to-b from-gray-100 to-gray-300 border border-gray-400 text-[10px] font-bold py-1 rounded text-gray-700 leading-none">
              レジオープン
            </button>
            <button className="w-8 h-6 bg-gradient-to-b from-gray-100 to-gray-300 border border-gray-400 rounded flex items-center justify-center text-xs">
              🏷️
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}