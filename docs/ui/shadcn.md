# shadcn/ui Documentation

## Why Shadcn UI

shadcn/ui is a collection of re-usable components built with Radix UI and Tailwind CSS. Unlike traditional component libraries, shadcn/ui components are **copy-pasted into your codebase**, giving you full control over the code and styling.

### Key Benefits

- **Own your code**: Components live in your codebase, not in node_modules
- **Tailwind-first**: Built with Tailwind CSS utility classes
- **Accessible**: Built on Radix UI Primitives for excellent accessibility
- **Customizable**: Easy to modify and extend since the code is yours
- **Type-safe**: Full TypeScript support
- **No runtime overhead**: Components compile to standard React code

## Shadcn UI React Components

The following components are installed and available in `apps/web/src/components/ui/`:

### Layout & Structure

- **Accordion** - Collapsible content sections
- **Aspect Ratio** - Maintain aspect ratios for responsive media
- **Card** - Container for content with header, body, and footer
- **Collapsible** - Show/hide content with animation
- **Resizable** - Resizable panels and split views
- **Scroll Area** - Custom scrollable containers
- **Separator** - Visual dividers between content
- **Sheet** - Slide-out panels from screen edges
- **Skeleton** - Loading placeholders

### Navigation

- **Breadcrumb** - Hierarchical navigation trail
- **Menubar** - Application menu bar
- **Navigation Menu** - Main site navigation
- **Pagination** - Page navigation controls
- **Tabs** - Tabbed content interface

### Forms & Inputs

- **Button** - Primary action buttons
- **Checkbox** - Checkbox inputs
- **Input** - Text input fields
- **Input OTP** - One-time password inputs
- **Label** - Form field labels
- **Radio Group** - Radio button groups
- **Select** - Dropdown select menus
- **Slider** - Range input slider
- **Switch** - Toggle switches
- **Textarea** - Multi-line text inputs
- **Toggle** - Toggle button groups
- **Form** - Form wrapper with validation

### Overlays & Dialogs

- **Alert Dialog** - Modal confirmation dialogs
- **Dialog** - Modal dialogs
- **Drawer** - Mobile-friendly slide-out drawers
- **Dropdown Menu** - Context menus and dropdowns
- **Hover Card** - Card revealed on hover
- **Popover** - Floating content containers
- **Context Menu** - Right-click context menus

### Feedback & Display

- **Alert** - Alert messages and notifications
- **Avatar** - User avatars and profile images
- **Badge** - Status badges and labels
- **Calendar** - Date picker calendar
- **Carousel** - Image/content carousels
- **Command** - Command palette interface
- **Progress** - Progress indicators
- **Sonner** - Toast notifications
- **Table** - Data tables

## Why AI Coding Tools Love Shadcn UI

1. **Copy-paste architecture**: AI tools can easily read, understand, and modify component code since it's in your codebase
2. **Clear structure**: Components follow consistent patterns making them easy to reason about
3. **Tailwind classes**: Utility-first CSS makes it easy to understand styling at a glance
4. **TypeScript**: Strong typing helps AI tools understand component APIs
5. **No abstraction layers**: Direct React code without complex wrapper libraries
6. **Documentation**: Each component has clear examples and API documentation

## Get Started

### Installation

shadcn/ui is already configured in this project. Components are located in `apps/web/src/components/ui/`.

### Adding Components

To add a new component:

```bash
cd apps/web
npx shadcn@latest add <component-name>
```

For example:

```bash
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add form
```

### Using Components

Import components from `@/components/ui`:

```tsx
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export function MyComponent() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
                <p>Dialog content here</p>
            </DialogContent>
        </Dialog>
    );
}
```

### Styling

Components use Tailwind CSS classes and CSS variables defined in `apps/web/src/styles/globals.css`. You can customize:

- **Colors**: Modify CSS variables in `globals.css` (`--primary`, `--secondary`, etc.)
- **Spacing**: Use Tailwind spacing utilities
- **Components**: Edit component files directly since they're in your codebase

### Theming

The project uses CSS variables for theming. Light and dark modes are supported via the `:root` and `.dark` classes in `globals.css`.

## Component Catalog

All installed components are available in `apps/web/src/components/ui/`:

| Component       | Path                              | Description                  |
| --------------- | --------------------------------- | ---------------------------- |
| Accordion       | `@/components/ui/accordion`       | Collapsible content sections |
| Alert           | `@/components/ui/alert`           | Alert messages               |
| Alert Dialog    | `@/components/ui/alert-dialog`    | Modal confirmations          |
| Aspect Ratio    | `@/components/ui/aspect-ratio`    | Maintain aspect ratios       |
| Avatar          | `@/components/ui/avatar`          | User avatars                 |
| Badge           | `@/components/ui/badge`           | Status badges                |
| Breadcrumb      | `@/components/ui/breadcrumb`      | Navigation trail             |
| Button          | `@/components/ui/button`          | Action buttons               |
| Calendar        | `@/components/ui/calendar`        | Date picker                  |
| Card            | `@/components/ui/card`            | Content containers           |
| Carousel        | `@/components/ui/carousel`        | Image carousels              |
| Checkbox        | `@/components/ui/checkbox`        | Checkbox inputs              |
| Collapsible     | `@/components/ui/collapsible`     | Show/hide content            |
| Command         | `@/components/ui/command`         | Command palette              |
| Context Menu    | `@/components/ui/context-menu`    | Right-click menus            |
| Dialog          | `@/components/ui/dialog`          | Modal dialogs                |
| Drawer          | `@/components/ui/drawer`          | Slide-out panels             |
| Dropdown Menu   | `@/components/ui/dropdown-menu`   | Dropdown menus               |
| Form            | `@/components/ui/form`            | Form wrapper                 |
| Hover Card      | `@/components/ui/hover-card`      | Hover cards                  |
| Input           | `@/components/ui/input`           | Text inputs                  |
| Input OTP       | `@/components/ui/input-otp`       | OTP inputs                   |
| Label           | `@/components/ui/label`           | Form labels                  |
| Menubar         | `@/components/ui/menubar`         | Menu bars                    |
| Navigation Menu | `@/components/ui/navigation-menu` | Site navigation              |
| Pagination      | `@/components/ui/pagination`      | Page navigation              |
| Popover         | `@/components/ui/popover`         | Floating content             |
| Progress        | `@/components/ui/progress`        | Progress bars                |
| Radio Group     | `@/components/ui/radio-group`     | Radio buttons                |
| Resizable       | `@/components/ui/resizable`       | Resizable panels             |
| Scroll Area     | `@/components/ui/scroll-area`     | Custom scrollbars            |
| Select          | `@/components/ui/select`          | Dropdown selects             |
| Separator       | `@/components/ui/separator`       | Dividers                     |
| Sheet           | `@/components/ui/sheet`           | Slide-out sheets             |
| Skeleton        | `@/components/ui/skeleton`        | Loading placeholders         |
| Slider          | `@/components/ui/slider`          | Range sliders                |
| Sonner          | `@/components/ui/sonner`          | Toast notifications          |
| Switch          | `@/components/ui/switch`          | Toggle switches              |
| Table           | `@/components/ui/table`           | Data tables                  |
| Tabs            | `@/components/ui/tabs`            | Tabbed interface             |
| Textarea        | `@/components/ui/textarea`        | Multi-line inputs            |
| Toggle          | `@/components/ui/toggle`          | Toggle buttons               |

## Resources

- [shadcn/ui Website](https://ui.shadcn.com/)
- [Radix UI Primitives](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Component Examples](https://ui.shadcn.com/docs/components)
