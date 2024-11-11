import { JsonMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { PublicKey } from "@metaplex-foundation/umi";
import React from "react";
import { Typography, Divider, Row, Col, Card, Collapse } from "antd";

const { Panel } = Collapse;
const { Text } = Typography;

const Trait = ({ heading, description }) => {
  return (
    <div
      style={{
        backgroundColor: "#ebebeb",
        borderRadius: "5px",
        width: "120px",
        minHeight: "50px",
        padding: "10px",
        textAlign: "center",
      }}
    >
      <Text>{heading}</Text>
      <Text style={{ marginTop: "-2px", fontWeight: "semibold" }}>
        {description}
      </Text>
    </div>
  );
};

const Traits = ({ metadata }) => {
  if (metadata === undefined || metadata.attributes === undefined) {
    return null;
  }

  // Find all attributes with trait_type and value
  const traits = metadata.attributes.filter(
    (a) => a.trait_type !== undefined && a.value !== undefined
  );
  const traitList = traits.map((t) => (
    <Trait
      key={t.trait_type}
      heading={t.trait_type ?? ""}
      description={t.value ?? ""}
    />
  ));

  return (
    <>
      <Divider style={{ marginTop: "15px" }} />
      <Row gutter={16} style={{ marginTop: "15px" }}>
        {traitList.map((trait) => (
          <Col span={8} key={trait.key}>
            {trait}
          </Col>
        ))}
      </Row>
    </>
  );
};

export default function CardComponent({ metadata }) {
  // Get the images from the metadata if animation_url is present use this
  if (!metadata) {
    return null;
  }
  const image = metadata.animation_url ?? metadata.image;
  return (
    <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
      <div
        style={{
          height: "200px",
          position: "relative",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundImage: `url(${image})`,
        }}
      />
      <Text style={{ fontWeight: "semibold", marginTop: "15px" }}>
        {metadata.name}
      </Text>
      <Text>{metadata.description}</Text>
      <Traits metadata={metadata} />
    </div>
  );
}

export const ShowNft = ({ nfts }) => {
  if (nfts === undefined) {
    return null;
  }

  const panels = nfts.map((nft) => (
    <Panel header={nft.offChainMetadata?.name} key={nft.mint}>
      <CardComponent metadata={nft.offChainMetadata} />
    </Panel>
  ));

  return (
    <Collapse defaultActiveKey={["0"]} accordion>
      {panels}
    </Collapse>
  );
};