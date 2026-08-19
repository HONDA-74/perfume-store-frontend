/**
 * Address Adapter
 *
 * Handles structure mismatches between backend Address schema
 * and UI form expectations from migrated Figma checkout/account components.
 *
 * Backend Address:
 * - recipientName (single field)
 * - street
 * - city
 * - country
 * - postalCode
 * - phone
 *
 * UI Address Form:
 * - firstName + lastName
 * - address + apartment (optional)
 * - city + governorate (optional)
 * - country
 * - postalCode
 * - phone
 */

/**
 * UI address form structure
 */
export interface AddressFormData {
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  governorate?: string;
  postalCode?: string;
  country: string;
  phone: string;
}

/**
 * Backend address structure (matches User.addresses[] schema)
 */
export interface BackendAddress {
  _id?: string;
  label?: string;
  recipientName: string;
  street: string;
  city: string;
  country: string;
  postalCode?: string;
  phone: string;
  isDefault?: boolean;
}

/**
 * Transform UI form data to backend Address format
 */
export function mapAddressToBackend(uiAddress: AddressFormData, label?: string): BackendAddress {
  // Combine first and last name
  const recipientName = `${uiAddress.firstName.trim()} ${uiAddress.lastName.trim()}`.trim();

  // Combine address and apartment into street field
  let street = uiAddress.address.trim();
  if (uiAddress.apartment?.trim()) {
    street += `, ${uiAddress.apartment.trim()}`;
  }

  // Use governorate if provided, otherwise fall back to city
  const city = uiAddress.governorate?.trim() || uiAddress.city.trim();

  return {
    recipientName,
    street,
    city,
    country: uiAddress.country.trim(),
    postalCode: uiAddress.postalCode?.trim(),
    phone: uiAddress.phone.trim(),
    label,
  };
}

/**
 * Transform backend Address to UI form data
 */
export function mapAddressFromBackend(backendAddress: BackendAddress): AddressFormData {
  // Split recipientName into first and last name
  const nameParts = backendAddress.recipientName.trim().split(/\s+/);
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  // Attempt to split street into address + apartment
  // Look for common separators: comma, semicolon, dash
  const streetParts = backendAddress.street.split(/[,;—-]/);
  const address = streetParts[0]?.trim() || '';
  const apartment = streetParts[1]?.trim();

  return {
    firstName,
    lastName,
    address,
    apartment,
    city: backendAddress.city,
    governorate: backendAddress.city, // Backend has single city field
    postalCode: backendAddress.postalCode,
    country: backendAddress.country,
    phone: backendAddress.phone,
  };
}

/**
 * Map array of backend addresses to UI format
 */
export function mapAddressesFromBackend(addresses: BackendAddress[]): AddressFormData[] {
  return addresses.map(mapAddressFromBackend);
}

/**
 * Create a formatted display string for an address
 */
export function formatAddressDisplay(address: BackendAddress): string {
  const parts = [
    address.recipientName,
    address.street,
    address.city,
    address.postalCode,
    address.country,
  ].filter((part): part is string => Boolean(part));

  return parts.join(', ');
}
