import { useEffect, useState, useCallback } from "react";
import { json } from "@remix-run/node";
import {
  useActionData,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  VerticalStack,
  Card,
  Button,
  HorizontalStack,
  Box,
  Divider,
  List,
  Link,
  Badge,
  TextField,
  Spinner,
  MediaCard,
} from "@shopify/polaris";

import { authenticate } from "../shopify.server";
import { _getShopFromQuery, _getAdminFromShop } from "../my_util";
import { useAppBridge } from '@shopify/app-bridge-react';
import { authenticatedFetch } from "@shopify/app-bridge-utils";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);

  return json({ shop: session.shop.replace(".myshopify.com", "") });
};

export async function action({ request }) {
  const { admin } = await authenticate.admin(request);

  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];
  const response = await admin.graphql(
    `#graphql
      mutation populateProduct($input: ProductInput!) {
        productCreate(input: $input) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }`,
    {
      variables: {
        input: {
          title: `${color} Snowboard`,
          variants: [{ price: Math.random() * 100 }],
        },
      },
    }
  );

  const responseJson = await response.json();

  return json({
    product: responseJson.data.productCreate.product,
  });
}

export default function Index() {
  const nav = useNavigation();
  const { shop } = useLoaderData();
  const actionData = useActionData();
  const submit = useSubmit();

  const isLoading =
    ["loading", "submitting"].includes(nav.state) && nav.formMethod === "POST";

  const productId = actionData?.product?.id.replace(
    "gid://shopify/Product/",
    ""
  );

  useEffect(() => {
    if (productId) {
      shopify.toast.show("Product created");
    }
  }, [productId]);

  const generateProduct = () => submit({}, { replace: true, method: "POST" });

  // const app = useAppBridge();

  // const shop = _getShopFromQuery(window);

  const [meta, setMeta] = useState('');
  const metaChange = useCallback((newMeta) => setMeta(newMeta), []);

  // const [id, setId] = useState('');
  // const idChange = useCallback((newId) => setId(newId), []);

  // const [result, setResult] = useState('');
  // const [accessing, setAccessing] = useState(false);

  // const handleSubmit = () => {
  //   console.log("FormData to be submitted:", meta);
  //   submit(meta, { replace: true, method: "POST" });
  //   console.log("Submitted!");
  // };

  return (
    <Page>
      <ui-title-bar title="成果課題5"></ui-title-bar>
      <VerticalStack gap="5">
        <Layout>
          <Layout.Section>
            <Text variant="heading2xl" as="h3">Shopify Function（Cart and Checkout Validation Function API）</Text>
            <Card>
              <Layout>
                <Layout.Section>
                  <List type="number">
                    <List.Item>
                      商品のカスタムデータに<Link url={`https://${_getAdminFromShop(shop)}/settings/custom_data`} target="_blank">メタフィールド</Link>を作成します。<br />
                      タイプ：<Badge>整数</Badge>,　名前：<Badge>Max Amount</Badge>,　ネームスペースとキー<Badge>custom.max_amount</Badge><br />
                      ※上記以外のネームスペースとキーの場合動作できません。
                      {/* <form onSubmit={handleSubmit}>
                        <TextField
                          label=""
                          value={meta}
                          onChange={setMeta}
                          autoComplete="off"
                          placeholder="Example: custom.max_amount"
                        />
                        <Button loading={isLoading} primary onClick={handleSubmit}>
                          送信
                        </Button>
                      </form> */}
                    </List.Item>
                    <List.Item>
                      <Link url={`https://${_getAdminFromShop(shop)}/products`} target="_blank">商品</Link>に追加されたメタフィールド：<Badge>Max amount</Badge>に数量を設定します。<br />
                      （例：2を入力 = 2点まで購入可能）
                    </List.Item>
                    <List.Item>
                      設定 ＞ <Link url={`https://${_getAdminFromShop(shop)}/settings/checkout`} target="_blank">チェックアウト</Link>からチェックアウトルールの追加を選択して、
                      <Badge status='info'>cart-checkout-validation</Badge>を有効化します。
                    </List.Item>
                    <List.Item>
                      カートで購入数量上限のバリデーションが動作します。
                      <img
                        alt=""
                        width="70%"
                        height="70%"
                        style={{
                          // objectFit: 'cover',
                          objectPosition: 'center',
                        }}
                        src="https://i.gyazo.com/9f2f0b144707dd285310aae75f199e4b.png"
                      />
                    </List.Item>
                  </List>
                </Layout.Section>
              </Layout>
            </Card>
          </Layout.Section>
        </Layout>
        <Layout>
          <Layout.Section>
            <Text variant="heading2xl" as="h3">Checkout UI Extension</Text>
            <Card>
              <Layout>
                <Layout.Section>
                  <List type="number">
                    <List.Item>
                      テーマのカスタマイズからチェックアウト画面の編集に移動し、
                      アプリブロック<Badge status='info'>checkout-ui</Badge>を追加します。
                    </List.Item>
                    <List.Item>
                      好きな場所に配置して保存します。
                    </List.Item>
                    <List.Item>
                      購入数量に応じてメッセージが表示されます。<br />
                      （パターン：3点以下の場合、3点以上・5点以下の場合、5点以上の場合）
                      <img
                        alt=""
                        width="70%"
                        height="70%"
                        style={{
                          // objectFit: 'cover',
                          objectPosition: 'center',
                        }}
                        src="https://i.gyazo.com/76917ebcac3c07afd69343885b6263e1.png"
                      />
                    </List.Item>
                  </List>
                </Layout.Section>
              </Layout>
            </Card>
          </Layout.Section>
        </Layout>
        <Layout>
          <Layout.Section>
            <Text variant="heading2xl" as="h3">App proxies</Text>
            <Card>
              <Layout>
                <Layout.Section>
                  <List type="number">
                    <List.Item>
                      アプリプロキシの設定は以下となっています。<br />
                      ・サブパスのプリフィックス：apps<br />
                      ・サブパス：dev-app-proxy<br />
                      ・プロキシURL：https://dev-app-proxy.onrender.com/app_proxy
                    </List.Item>
                    <List.Item>
                      <Button url={`https://${_getAdminFromShop(shop)}/apps/dev-app-proxy/app_path/`} target="_blank">プロキシURLにアクセス</Button>
                    </List.Item>
                  </List>
                </Layout.Section>
              </Layout>
            </Card>
          </Layout.Section>
        </Layout>
      </VerticalStack>
    </Page>
  );
}
