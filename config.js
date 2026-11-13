/**
 * Configuración global del proyecto.
 * Contiene IDs de carpetas, plantillas, hojas de cálculo
 * y constantes generales como el IVA.
 */

const CONFIG = {
  TEXTS: {
    GEHIGARRIAK: {
      HAIZEAK: "Haizeak (Tronboia eta tronpeta)\nVientos (Trombón y trompeta)",
      AFARIA: "Musikari eta teknikarien afaria\nCena de músicos y técnicos",
      SON_EXTRA: "Sonorizazio gehigarria\nSonorización extra"
    },
    EKIPOA: {
      TITLE: {
        "8500": "Equipo 8500W",
        "17000": "Equipo 17000W",
        "25000": "Equipo 25000W",
        "WITHOUT": "Sin equipo"
      },
      TABLE: {
        "Bodas": "Soinu eta Argi Ekipamendua\nEquipo de Sonido e Iluminación",
        "Estándar": "Soinu eta Argi Ekipamendua\nEquipo de Sonido e Iluminación",
        "Sin Equipo": "Soinu teknikaria\nTécnico de sonido",
        "8500": "*Soinu eta Argi Ekipamendua 8.500W\n*Equipo de Sonido e Iluminación 8.500W",
        "17000": "*Soinu eta Argi Ekipamendua 17.000W\n*Equipo de Sonido e Iluminación 17.000W",
        "WITHOUT": "Soinu teknikaria\nTécnico de sonido"
      }
    },
    MESES: {
      ES: ["enero","febrero","marzo","abril","mayo","junio",
           "julio","agosto","septiembre","octubre","noviembre","diciembre"],
      EU: ["urtarrila","otsaila","martxoa","apirila","maiatza","ekaina",
                   "uztaila","abuztua","iraila","urria","azaroa","abendua"]
    }
  },
  GEHIGARRIAK: {
    HAIZEAK: "",
    AFARIA: 200,
    KANPO: 1000
  },
  ENVIRONMENTS: {
    WORK: {
      FOLDER_ID: {
        AURREKONTUA: '1sAMkBFc6RDqxPOTwfSb-tJSSvOeu5PL_',
        FAKTURA: '1o1xEafN6gtfoB3FuiVBH_JPgMWwGo1CO',
        KONTRATUA: '1jbJWbGPdzyES-I8PRZHV3bkrErRp5vFO'
      },
      PRICING_SHEET_ID: '1KZVGm5eMrM_cUnNtv4LYYjC1PaCvG3ZB-tCTFiR9AXU',
      TEMPLATE_ID: {
        AURREKONTUA: {
          "Bodas": "1crudZC12vCokdDmY58u6HjO1xCQu3BNz90vVZbOHBPE",
          "Estándar": "1crudZC12vCokdDmY58u6HjO1xCQu3BNz90vVZbOHBPE",
          "Sin Equipo": "1crudZC12vCokdDmY58u6HjO1xCQu3BNz90vVZbOHBPE",
          "8500": "1faNgxQycI_TgzYRE_cQeNhZMuYCjLpAy1-EZAji3ctY",
          "17000": "1IfeRjmFcuwbo6z47OlX_sjQrGRKVR0zR_w3Frwf254g"
        },
        FAKTURA: '1EPMFZIkduq54XCeuCi-TjoFeu7WMUVn0wXQn_8ITdmo',
        KONTRATUA: '161G-3eqJNC7TV0defDChbU9ZqsWLVlYjMc6Erws4kBw'
      }
    },
    PLAY: {
      FOLDER_ID: {
        AURREKONTUA: '1kiS2r9-BLhyO0Mgani3nPC78BZVS6ini',
        FAKTURA: '1MJL71e3rx-64acZ9gfTnWcXZKY3nvs3y',
        KONTRATUA: '1kiS2r9-BLhyO0Mgani3nPC78BZVS6ini'
      },
      PRICING_SHEET_ID: '1KZVGm5eMrM_cUnNtv4LYYjC1PaCvG3ZB-tCTFiR9AXU',
      TEMPLATE_ID: {
        AURREKONTUA: {
        "Bodas": "10QndyPS-7RRc7jaJ-hF9EnaScomXEAQ8VZdSRUV8EZc",
        "Estándar": "10QndyPS-7RRc7jaJ-hF9EnaScomXEAQ8VZdSRUV8EZc",
        "Sin Equipo": "10QndyPS-7RRc7jaJ-hF9EnaScomXEAQ8VZdSRUV8EZc"
        },
        FAKTURA: '1pztWHkYC0HUcidPU_jL6HFaWcTO33LA0RKu5EfpAEO8',
        KONTRATUA: '161G-3eqJNC7TV0defDChbU9ZqsWLVlYjMc6Erws4kBw'
      }
    }
  },
  IVA: 0.21
};