import { useEffect, useState } from "react";
import {
  Banner,
  useApi,
  useTranslate,
  reactExtension,
} from '@shopify/ui-extensions-react/checkout';

export default reactExtension(
  'purchase.checkout.block.render',
  () => <Extension />,
);

function Extension() {
  const translate = useTranslate();
  const { extension, lines } = useApi();

  const [totalQuantity, setTotalQuantity] = useState(0);

  useEffect(() => {
    const unsubscribe = lines.subscribe(actualLines => {
      const newTotal = actualLines.reduce((acc, line) => acc + line.quantity, 0);
      setTotalQuantity(newTotal);
    });
    
    return () => {
      unsubscribe();
    };
  }, [lines]);

  let message = '';

  if (totalQuantity >= 5) {
    message = '5点以上の購入者様：10%オフのクーポンをプレゼントします！';
  } else if (totalQuantity >= 3) {
    message = '3点以上の購入者様：送料無料です（5点以上でさらに特典が追加されます！）';
  } else {
    message = '3点購入で送料無料の特典があります。もう1点追加してみませんか？';
  }

  return (
    <Banner title="購入特典">
      {message}
    </Banner>
  );
}