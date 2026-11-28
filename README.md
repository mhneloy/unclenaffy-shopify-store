# Uncle Naffy Shopify storefront

This Online Store 2.0 theme uses separate Shopify page templates for Home, Price List, Gallery, About and Book Appointment. Home introduces the shop and links to the other pages. Location, opening hours and optional feedback are part of the booking page.

## Shopify setup

Upload the ZIP as an unpublished theme. Home uses the built-in homepage route. Create the other four pages under **Online Store → Pages** with the handles below. Shopify requires those page resources for the routes to resolve. When the templates are available for assignment in Shopify admin, select the matching template. In an unpublished preview, the theme can use the matching alternate template through the `view` parameter. Pages with other handles can be selected in **Theme settings → Uncle Naffy storefront**.

| Page | Handle | Template suffix |
| --- | --- | --- |
| Price List | `price-list` | `un-prices` |
| Gallery | `gallery` | `un-gallery` |
| About | `about-uncle-naffy` | `un-about` |
| Book Appointment | `book-appointment` | `un-book` |

In the Theme Editor, select the logo, palette, fonts, links and verified contact details. Replace the illustrative photographs through the image pickers in each page’s sections and blocks. The homepage animates its default aerial image and accepts approved aerial video through its Shopify-hosted video picker. The price rows have editable photos and support a text-only view through their **Show service images** switch.

## Theme Editor styling

- **Header → Book Now page** sets the header button destination. Leave it empty to follow the global Book Appointment page. **Header**, **Hero**, and **Footer** each have a logo picker and use the global **Brand logo** when that picker is empty. The hero uses the supplied silver logo when both pickers are empty.
- Each Uncle Naffy section has its own padding, margin, colours and typography controls for the elements it displays. A blank colour or **Default** font style follows the design. The padding sliders use `-4` for the layout default, and the font-size sliders use `0` for the responsive default.
- **Theme settings → Uncle Naffy storefront** controls the site palette, default display and body fonts, page background overrides, and overall content width and side spacing.

The footer can link to approved policy pages through its policy menu. The `un-privacy`, `un-cookies`, `un-terms` and `un-cancellation` templates include review briefs in the Theme Editor. Add approved wording to the Shopify pages before linking them.

## Booking and launch

After installing your booking app, open the **Book Appointment** template in the Theme Editor. In **Uncle Naffy booking**, choose **Add block** and select the booking app block. The block replaces the illustrated calendar placeholder, and the visit information and FAQs stay visible. If your booking provider supplies a hosted Acuity link instead, those settings are still available under **Theme settings → Uncle Naffy storefront**.

Configure availability, reminders, deposits and cancellation in the booking app. Match the published prices and durations in the Shopify price list and homepage preview. Verify availability, confirmations, deposits, rescheduling and cancellation with an authorised test booking.

Enable the Shopify feedback form once its privacy notice and receiving inbox are approved. Verify delivery and the storefront consent settings on the enrolled store. Replace the demo media, prices and biography before publication. The advanced staff, loyalty and inventory workflows are outside the configured theme and depend on the approved operational scope.
