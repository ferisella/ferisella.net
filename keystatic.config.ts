import { config, collection, singleton, fields } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  collections: {
    releases: collection({
      label: 'Music Releases',
      slugField: 'title',
      path: 'src/content/releases/*',
      format: { data: 'json' },
      schema: {
        title: fields.slug({
          name: {
            label: 'Title',
            description: 'Release title (album, EP, single name)',
            validation: { length: { min: 1 } },
          },
        }),
        year: fields.integer({
          label: 'Year',
          description: 'Release year (e.g., 2025)',
          validation: { min: 1900, max: 2100 },
        }),
        note_es: fields.text({
          label: 'Note (Spanish)',
          description: 'Optional note in Spanish',
          multiline: true,
        }),
        note_en: fields.text({
          label: 'Note (English)',
          description: 'Optional note in English',
          multiline: true,
        }),
        tag_es: fields.text({
          label: 'Tag (Spanish)',
          description: 'e.g., "Álbum", "EP", "Single"',
        }),
        tag_en: fields.text({
          label: 'Tag (English)',
          description: 'e.g., "Album", "EP", "Single"',
        }),
        bandcamp_id: fields.text({
          label: 'Bandcamp album ID',
          description: 'Numeric ID for the embedded player (from the album page embed code)',
        }),
        bandcamp_url: fields.text({
          label: 'Bandcamp URL',
          description: 'Full album URL, e.g., https://ferisella.bandcamp.com/album/my-heart',
        }),
      },
    }),

    collaborators: collection({
      label: 'Collaborators',
      slugField: 'name',
      path: 'src/content/collaborators/*',
      format: { data: 'json' },
      schema: {
        name: fields.slug({
          name: {
            label: 'Name',
            description: 'Person or organization name',
            validation: { length: { min: 1 } },
          },
        }),
        role_es: fields.text({
          label: 'Role (Spanish)',
          description: 'e.g., "Productor", "Artista"',
          validation: { length: { min: 1 } },
        }),
        role_en: fields.text({
          label: 'Role (English)',
          description: 'e.g., "Producer", "Artist"',
          validation: { length: { min: 1 } },
        }),
      },
    }),
  },

  singletons: {
    highlights: singleton({
      label: 'Featured Highlights',
      path: 'src/content/highlights',
      format: { data: 'json' },
      schema: {
        items: fields.array(
          fields.object({
            label_es: fields.text({
              label: 'Category label (Spanish)',
              description: 'e.g., "Álbum", "Tecnología", "Ensayo"',
            }),
            label_en: fields.text({
              label: 'Category label (English)',
              description: 'e.g., "Album", "Technology", "Essay"',
            }),
            title: fields.text({
              label: 'Title',
              validation: { length: { min: 1 } },
            }),
            description: fields.text({
              label: 'Description',
              multiline: true,
            }),
            link: fields.text({
              label: 'Link',
              description: 'URL or internal link',
            }),
          }),
          {
            label: 'Featured Items',
            itemLabel: (props) => props.fields.title.value,
          }
        ),
      },
    }),
  },
});
