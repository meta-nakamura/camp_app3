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

  const handleSubmit = () => {
    console.log("FormData to be submitted:", meta);
    submit(meta, { replace: true, method: "POST" });
    console.log("Submitted!");
  };

  return (
    <Page title ="Shopify Function（Cart and Checkout Validation Function API）">
      <ui-title-bar title="成果課題5">
        {/* <button variant="primary" onClick={generateProduct}>
          Generate a product
        </button> */}
      </ui-title-bar>
      <VerticalStack gap="5">
        <Layout>
          <Layout.Section>
            <Card>
              <Layout>
                <Layout.Section>
                  <List type="number">
                    <List.Item>
                      <Badge status='info'>商品</Badge>の<Link url={`https://${_getAdminFromShop(shop)}/settings/custom_data`} target="_blank">メタフィールド</Link>を作成します<br />
                      タイプ：<Badge>整数</Badge>,　名前：<Badge>Max Amount</Badge>,　ネームスペースとキー<Badge>custom.max_amount</Badge><br />
                      ※上記以外のネームスペースとキーの場合動作ができません。
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
                      <Link url={`https://${_getAdminFromShop(shop)}/products`} target="_blank">商品</Link>に追加されたメタフィールド：<Badge>Max amount</Badge>に数量を設定しします<br />
                      （例：2を入力 = 2点まで購入可能）
                    </List.Item>
                    <List.Item>
                      設定 ＞ <Link url={`https://${_getAdminFromShop(shop)}/settings/checkout`} target="_blank">チェックアウト</Link>からチェックアウトルールの追加を選択して<br />
                      <Badge status='info'>cart-checkout-validation</Badge>を有効化します
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
            {/* <Card>
              <VerticalStack gap="5">
                <VerticalStack gap="2">
                  <Text as="h2" variant="headingMd">
                    Congrats on creating a new Shopify app 🎉
                  </Text>
                  <Text variant="bodyMd" as="p">
                    This embedded app template uses{" "}
                    <Link
                      url="https://shopify.dev/docs/apps/tools/app-bridge"
                      target="_blank"
                    >
                      App Bridge
                    </Link>{" "}
                    interface examples like an{" "}
                    <Link url="/app/additional">
                      additional page in the app nav
                    </Link>
                    , as well as an{" "}
                    <Link
                      url="https://shopify.dev/docs/api/admin-graphql"
                      target="_blank"
                    >
                      Admin GraphQL
                    </Link>{" "}
                    mutation demo, to provide a starting point for app
                    development.
                  </Text>
                </VerticalStack>
                <VerticalStack gap="2">
                  <Text as="h3" variant="headingMd">
                    Get started with products
                  </Text>
                  <Text as="p" variant="bodyMd">
                    Generate a product with GraphQL and get the JSON output for
                    that product. Learn more about the{" "}
                    <Link
                      url="https://shopify.dev/docs/api/admin-graphql/latest/mutations/productCreate"
                      target="_blank"
                    >
                      productCreate
                    </Link>{" "}
                    mutation in our API references.
                  </Text>
                </VerticalStack>
                <HorizontalStack gap="3" align="end">
                  {actionData?.product && (
                    <Button
                      url={`https://admin.shopify.com/store/${shop}/admin/products/${productId}`}
                      target="_blank"
                    >
                      View product
                    </Button>
                  )}
                  <Button loading={isLoading} primary onClick={generateProduct}>
                    Generate a product
                  </Button>
                </HorizontalStack>
                {actionData?.product && (
                  <Box
                    padding="4"
                    background="bg-subdued"
                    borderColor="border"
                    borderWidth="1"
                    borderRadius="2"
                    overflowX="scroll"
                  >
                    <pre style={{ margin: 0 }}>
                      <code>{JSON.stringify(actionData.product, null, 2)}</code>
                    </pre>
                  </Box>
                )}
              </VerticalStack>
            </Card> */}
          </Layout.Section>
          {/* <Layout.Section secondary>
            <VerticalStack gap="5">
              <Card>
                <VerticalStack gap="2">
                  <Text as="h2" variant="headingMd">
                    App template specs
                  </Text>
                  <VerticalStack gap="2">
                    <Divider />
                    <HorizontalStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        Framework
                      </Text>
                      <Link url="https://remix.run" target="_blank">
                        Remix
                      </Link>
                    </HorizontalStack>
                    <Divider />
                    <HorizontalStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        Database
                      </Text>
                      <Link url="https://www.prisma.io/" target="_blank">
                        Prisma
                      </Link>
                    </HorizontalStack>
                    <Divider />
                    <HorizontalStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        Interface
                      </Text>
                      <span>
                        <Link url="https://polaris.shopify.com" target="_blank">
                          Polaris
                        </Link>
                        {", "}
                        <Link
                          url="https://shopify.dev/docs/apps/tools/app-bridge"
                          target="_blank"
                        >
                          App Bridge
                        </Link>
                      </span>
                    </HorizontalStack>
                    <Divider />
                    <HorizontalStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        API
                      </Text>
                      <Link
                        url="https://shopify.dev/docs/api/admin-graphql"
                        target="_blank"
                      >
                        GraphQL API
                      </Link>
                    </HorizontalStack>
                  </VerticalStack>
                </VerticalStack>
              </Card>
              <Card>
                <VerticalStack gap="2">
                  <Text as="h2" variant="headingMd">
                    Next steps
                  </Text>
                  <List spacing="extraTight">
                    <List.Item>
                      Build an{" "}
                      <Link
                        url="https://shopify.dev/docs/apps/getting-started/build-app-example"
                        target="_blank"
                      >
                        {" "}
                        example app
                      </Link>{" "}
                      to get started
                    </List.Item>
                    <List.Item>
                      Explore Shopify’s API with{" "}
                      <Link
                        url="https://shopify.dev/docs/apps/tools/graphiql-admin-api"
                        target="_blank"
                      >
                        GraphiQL
                      </Link>
                    </List.Item>
                  </List>
                </VerticalStack>
              </Card>
            </VerticalStack>
          </Layout.Section> */}
        </Layout>
      </VerticalStack>
    </Page>
  );
}
