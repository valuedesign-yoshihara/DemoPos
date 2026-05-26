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
    // 全体を flex-col / h-screen にして、画面の縦幅100%を強制ロック
    <div className="h-screen w-screen bg-[#F3EAD1] p-4 text-[#333333] font-sans select-none flex flex-col overflow-hidden relative">
      
      {isLoading && (
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center space-y-4">
            <div className="animate-spin h-10 w-10 border-4 border-[#547394] border-t-transparent rounded-full"></div>
            <p className="text-sm font-bold text-gray-700">決済処理中...</p>
          </div>
        </div>
      )}

      {/* 1. ヘッダーエリア（高さを固定） */}
      <div className="flex-none flex items-center justify-between mb-3">
        <div className="flex items-center space-x-4">
          <div className="bg-[#89C598] border border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] px-8 py-2 text-xl font-bold tracking-wider">
            売店 POS System
          </div>
          <div className="flex flex-col space-y-1">
            <div className="bg-[#EAD69E] text-center text-xs py-0.5 px-4 font-bold">販売</div>
            <div className="flex items-center text-sm border border-gray-400 bg-white">
              <span className="bg-[#82868A] text-white px-2 py-1 text-xs">担当者</span>
              <span className="px-3 py-1 font-bold bg-[#D3EFE0]">1000 | システム管理者</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <button className="bg-[#D1D5DB] hover:bg-gray-300 border border-gray-400 text-[#C93B3B] font-bold px-4 py-2 rounded shadow-sm text-sm">
            返品
          </button>
          <div className="flex items-center text-xs border border-gray-300 bg-[#E5E7EB] px-2 py-1.5 rounded">
            <span className="text-gray-600 mr-2">伝票日付</span>
            <span className="bg-white px-3 py-0.5 border border-gray-300 font-mono">2026/05/11</span>
          </div>
        </div>
      </div>

      {/* 2. 入力・検索バー（高さを固定） */}
      <div className="flex-none bg-[#717375] p-3 flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2 flex-1 max-w-xl">
          <input 
            type="text" 
            placeholder="商品バーコード・短縮コード" 
            className="bg-[#D2F1FF] border border-gray-400 px-2 py-1 text-sm w-64 placeholder-gray-500 focus:outline-none"
            value={inputVal}
            disabled={isLoading}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputVal(e.target.value)}
          />
          <button 
            onClick={handleSearchClick}
            disabled={isLoading}
            className="bg-[#E5E7EB] hover:bg-gray-200 border border-gray-400 text-xs font-bold px-3 py-1.5 rounded shadow-sm"
          >
            商品一覧から検索
          </button>
        </div>
        <div className="flex space-x-1">
          <button className="bg-[#E5E7EB] p-1 border border-gray-400 rounded text-xs">▲</button>
          <button className="bg-[#E5E7EB] p-1 border border-gray-400 rounded text-xs">▼</button>
        </div>
      </div>

      {/* 3. メイン明細エリア（flex-1 で余った高さを全画面分使い切る） */}
      <div className="flex-1 bg-[#828487] p-1 text-sm overflow-y-auto border border-gray-600 min-h-0">
        <table className="w-full text-left border-collapse table-fixed">
          <thead className="sticky top-0 bg-[#828487] z-10">
            <tr className="text-white text-xs font-bold border-b border-gray-600">
              <th className="w-[18%] p-2 text-center">バーコード</th>
              <th className="w-[10%] p-2 text-center">短縮コード</th>
              <th className="w-[34%] p-2">商品名</th>
              <th className="w-[12%] p-2 text-right">単価</th>
              <th className="w-[14%] p-2 text-center">個数</th>
              <th className="w-[12%] p-2 text-right">金額</th>
              <th className="w-[6%] p-2 text-center"></th>
            </tr>
          </thead>
          <tbody>
            {cart.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-gray-300 pt-24 text-base">
                  商品が登録されていません。上のボタン等から追加できます。
                </td>
              </tr>
            ) : (
              cart.map((item) => (
                <tr key={item.barcode} className="bg-white border-b border-gray-400 font-bold text-gray-800">
                  <td className="bg-[#F6D99C] border-r border-gray-400 p-2 font-mono tracking-tighter text-sm truncate">{item.barcode}</td>
                  <td className="border-r border-gray-400 p-2 text-center font-mono">{item.code}</td>
                  <td className="border-r border-gray-400 p-2 truncate text-base">{item.name}</td>
                  <td className="border-r border-gray-400 p-2 text-right font-mono text-base">{item.price.toLocaleString()}</td>
                  <td className="border-r border-gray-400 p-1 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <button onClick={() => updateQuantity(item.barcode, -1)} disabled={isLoading} className="bg-[#D1D5DB] border border-gray-400 rounded px-2 py-0.5 text-xs">-</button>
                      <span className="w-6 inline-block text-center font-mono text-base">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.barcode, 1)} disabled={isLoading} className="bg-[#D1D5DB] border border-gray-400 rounded px-2 py-0.5 text-xs">+</button>
                    </div>
                  </td>
                  <td className="border-r border-gray-400 p-2 text-right font-mono text-base">{(item.price * item.quantity).toLocaleString()}</td>
                  <td className="p-1 text-center">
                    <button onClick={() => removeItem(item.barcode)} disabled={isLoading} className="bg-[#E25C5C] text-white text-[10px] font-bold px-1 py-1 rounded">削除</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 4. フッター・決済エリア（高さを下部に固定） */}
      <div className="flex-none mt-3 grid grid-cols-12 gap-4 h-44">
        
        {/* 左 */}
        <div className="col-span-3 flex flex-col justify-between">
          <button 
            onClick={handleCancel}
            disabled={isLoading}
            className="w-full h-20 bg-gradient-to-b from-gray-100 to-gray-300 border border-gray-400 shadow-sm text-sm font-bold rounded-md text-gray-800 disabled:opacity-50"
          >
            キャンセル
          </button>
          <button className="w-16 h-14 bg-gradient-to-b from-gray-100 to-gray-300 border border-gray-400 shadow-sm text-[11px] font-bold rounded flex items-center justify-center">
            日次集計
          </button>
        </div>

        {/* 中央 */}
        <div className="col-span-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <button className="bg-gradient-to-b from-gray-100 to-gray-300 border border-gray-400 text-xs font-bold px-4 py-1.5 rounded shadow-sm">領収書</button>
              <button className="bg-gradient-to-b from-gray-100 to-gray-300 border border-gray-400 text-xs font-bold px-4 py-1.5 rounded shadow-sm">合計表示</button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-gray-700">商品点数：</span>
              <div className="bg-[#EEF1F6] border border-gray-300 w-20 py-1 px-2 text-right font-mono text-lg font-bold rounded">
                {totalItems || ''}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="bg-[#828487] text-white text-xs py-0.5 font-bold">現金預かり金</div>
              <input 
                type="number"
                className="w-full bg-[#D6DCFF] border border-gray-400 text-right font-mono text-xl font-bold py-1 px-2 focus:outline-none"
                value={cashReceived}
                placeholder="入力"
                disabled={isLoading}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCashReceived(e.target.value)}
              />
            </div>
            <div>
              <div className="bg-[#828487] text-white text-xs py-0.5 font-bold">総合計</div>
              <div className="bg-[#EEF1F6] border border-gray-400 text-right font-mono text-xl font-bold py-1 px-2 text-blue-700">
                {totalPrice.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="bg-[#828487] text-white text-xs py-0.5 font-bold">おつり</div>
              <div className="bg-[#EEF1F6] border border-gray-400 text-right font-mono text-xl font-bold py-1 px-2 text-red-600">
                {cashReceived ? change.toLocaleString() : 0}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => handleAddTicket('お茶席券(冷)', 500)} disabled={isLoading} className="bg-gradient-to-b from-gray-100 to-[#E2E4E7] border-t-4 border-t-[#8DB7C7] border border-gray-400 shadow py-2 text-sm font-bold text-gray-700 rounded">
              お茶席券(冷)
            </button>
            <button onClick={() => handleAddTicket('お茶席券(温)', 500)} disabled={isLoading} className="bg-gradient-to-b from-gray-100 to-[#E2E4E7] border-t-4 border-t-[#D2938E] border border-gray-400 shadow py-2 text-sm font-bold text-gray-700 rounded">
              お茶席券(温)
            </button>
          </div>
        </div>

        {/* 右 */}
        <div className="col-span-3 flex flex-col justify-between space-y-2">
          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0 || isLoading}
            className="flex-1 bg-gradient-to-b from-white to-[#E2E3E5] hover:to-gray-300 border-2 border-[#547394] rounded-md flex flex-col items-center justify-center shadow-sm disabled:opacity-40"
          >
            <span className="text-base font-bold text-gray-800">決定</span>
            <span className="text-xs text-gray-600 font-bold">現金</span>
          </button>
          
          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0 || isLoading}
            className="flex-1 bg-gradient-to-b from-white to-[#E2E3E5] hover:to-gray-300 border-2 border-[#5F876E] rounded-md flex flex-col items-center justify-center shadow-sm disabled:opacity-40"
          >
            <span className="text-base font-bold text-gray-800">決定</span>
            <span className="text-xs text-gray-600 font-bold">クレジットカード</span>
          </button>

          <div className="flex space-x-2">
            <button className="flex-1 bg-gradient-to-b from-gray-100 to-gray-300 border border-gray-400 text-[11px] font-bold py-1.5 rounded text-gray-700">
              レジオープン
            </button>
            <button className="w-10 bg-gradient-to-b from-gray-100 to-gray-300 border border-gray-400 rounded flex items-center justify-center">
              🏷️
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}