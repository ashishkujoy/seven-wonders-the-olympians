import { assertEquals } from "assert";
import { describe, it } from "test/bdd";
import { Wonder } from "../src/models/wonder.js";

describe("testing the wonders class", () => {
  const olympia = {
    img: "olympiaA.jpeg",
    name: "Olympia",
    resource: "wood",
    side: "A",
    stages: {
      stage1: {
        cost: [{ type: "wood", count: 2 }],
        powers: [{ type: "points", value: 3 }],
      },
      stage2: {
        cost: [{ type: "stone", count: 2 }],
        powers: [{ type: "free_card_per_age" }],
      },
      stage3: {
        cost: [{ type: "ore", count: 2 }],
        powers: [{ type: "points", value: 7 }],
      },
    },
  };

  it("should give no of military points", () => {
    const wonder = new Wonder(olympia);

    wonder.build({
      name: "Guard Tower",
      age: 1,
      color: "red",
      min_players: 3,
      cost: [{ type: "clay", count: 1 }],
      produces: [{ type: "shield", count: 1 }],
      effect: null,
      chain_from: null,
      chain_to: [],
    });

    wonder.build({
      name: "Stockade",
      age: 1,
      color: "red",
      min_players: 3,
      cost: [{ type: "wood", count: 1 }],
      produces: [{ type: "shield", count: 1 }],
      effect: null,
      chain_from: null,
      chain_to: [],
    });

    wonder.build({
      name: "Barracks",
      age: 1,
      color: "red",
      min_players: 3,
      cost: [{ type: "ore", count: 1 }],
      produces: [{ type: "shield", count: 1 }],
      effect: null,
      chain_from: null,
      chain_to: ["Stables", "Walls"],
    });

    const militaryStrength = wonder.militaryStrength;

    assertEquals(militaryStrength, 3);
  });

  it("should give no of victory points", () => {
    const wonder = new Wonder(olympia);

    wonder.build({
      name: "Altar",
      age: 1,
      color: "blue",
      min_players: 3,
      cost: [],
      produces: [{ type: "points", count: 2 }],
      chain_from: null,
      chain_to: ["Temple"],
      type: "civil",
    });

    wonder.build({
      name: "Baths",
      age: 1,
      color: "blue",
      min_players: 3,
      cost: [{ type: "stone", count: 1 }],
      produces: [{ type: "points", count: 3 }],
      chain_from: null,
      chain_to: ["Aqueduct"],
      type: "civil",
    });

    wonder.build({
      name: "Theater",
      age: 1,
      color: "blue",
      min_players: 3,
      cost: [],
      produces: [{ type: "points", count: 2 }],
      chain_from: null,
      chain_to: ["Statue"],
      type: "civil",
    });

    wonder.build({
      name: "Pawn Shop",
      age: 1,
      color: "blue",
      min_players: 4,
      cost: [],
      produces: [{ type: "points", count: 3 }],
      chain_from: null,
      chain_to: [],
      type: "civil",
    });

    const victoryPoints = wonder.victoryPoints;

    assertEquals(victoryPoints, 10);
  });

  it("should get discounds", () => {
    const wonder = new Wonder(olympia);

    wonder.build({
      name: "East Trading Post",
      age: 1,
      color: "yellow",
      min_players: 3,
      cost: [],
      produces: [],
      effect: [
        {
          type: "resource",
          effect_type: "buy",
          cost: [{ type: "coin", count: 1 }],
          applies_to: ["right_neighbour"],
          options: ["clay", "stone", "wood", "ore"],
        },
      ],
      chain_from: null,
      chain_to: [],
    });

    wonder.build({
      name: "West Trading Post",
      age: 1,
      color: "yellow",
      min_players: 3,
      cost: [],
      produces: [],
      effect: [
        {
          type: "resource",
          effect_type: "buy",
          cost: [{ type: "coin", count: 1 }],
          applies_to: ["left_neighbour"],
          options: ["clay", "stone", "wood", "ore"],
        },
      ],
      chain_from: null,
      chain_to: [],
    });

    wonder.build({
      name: "Marketplace",
      age: 1,
      color: "yellow",
      min_players: 3,
      cost: [],
      produces: [],
      effect: [
        {
          type: "resource",
          effect_type: "buy",
          cost: [{ type: "coin", count: 1 }],
          applies_to: ["left_neighbour", "right_neighbour"],
          options: ["glass", "papyrus", "textile"],
        },
      ],
      chain_from: null,
      chain_to: [],
    });

    const discounts = wonder.discounts;
    const set1 = new Set([
      "clay",
      "glass",
      "ore",
      "papyrus",
      "stone",
      "textile",
      "wood",
    ]);

    const set2 = new Set([
      "clay",
      "glass",
      "ore",
      "papyrus",
      "stone",
      "textile",
      "wood",
    ]);
    const result = {
      "left_neighbour": set1,
      "right_neighbour": set2,
    };

    assertEquals(discounts, result);
  });

  it("should add stage benefit", () => {
    const wonder = new Wonder(olympia);

    wonder.build({
      name: "Altar",
      age: 1,
      color: "blue",
      min_players: 3,
      cost: [],
      produces: [{ type: "points", count: 2 }],
      chain_from: null,
      chain_to: ["Temple"],
      type: "civil",
    });

    wonder.build({
      name: "Baths",
      age: 1,
      color: "blue",
      min_players: 3,
      cost: [{ type: "stone", count: 1 }],
      produces: [{ type: "points", count: 3 }],
      chain_from: null,
      chain_to: ["Aqueduct"],
      type: "civil",
    });

    wonder.stage(
      wonder.build({
        name: "West Trading Post",
        age: 1,
        color: "yellow",
        min_players: 3,
        cost: [],
        produces: [],
        effect: [
          {
            type: "resource",
            effect_type: "buy",
            cost: [{ type: "coin", count: 1 }],
            applies_to: ["left_neighbour"],
            options: ["clay", "stone", "wood", "ore"],
          },
        ],
        chain_from: null,
        chain_to: [],
      }),
    );

    const victoryPoints = wonder.victoryPoints;
    assertEquals(victoryPoints, 8);
  });

  it("should get futureBenefits", () => {
    const wonder = new Wonder(olympia);

    wonder.build({
      name: "Apothecary",
      age: 1,
      color: "green",
      min_players: 3,
      cost: [{ type: "textile", count: 1 }],
      produces: [{ type: "compass", count: 1 }],
      effect: null,
      chain_from: null,
      chain_to: ["Stables", "Dispensary"],
    });

    wonder.build({
      name: "Baths",
      age: 1,
      color: "blue",
      min_players: 7,
      cost: [{ type: "stone", count: 1 }],
      produces: [{ type: "points", count: 3 }],
      chain_from: null,
      chain_to: ["Aqueduct"],
      type: "civil",
    });

    wonder.build({
      name: "Barracks",
      age: 1,
      color: "red",
      min_players: 3,
      cost: [{ type: "ore", count: 1 }],
      produces: [{ type: "shield", count: 1 }],
      effect: null,
      chain_from: null,
      chain_to: ["Stables", "Walls"],
    });

    const futureBenefits = wonder.futureBenefits;
    const result = new Set(["Stables", "Dispensary", "Aqueduct", "Walls"]);

    assertEquals(futureBenefits, result);
  });
});
