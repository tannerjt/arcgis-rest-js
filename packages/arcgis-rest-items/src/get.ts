/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  IRequestOptions,
  getPortalUrl
} from "@esri/arcgis-rest-request";

import { IItem } from "@esri/arcgis-rest-common-types";

import {
  IItemIdRequestOptions,
  IItemDataRequestOptions,
  IItemRelationshipRequestOptions
 } from "./helpers";

/**
 * ```import { getItem } from "@esri/arcgis-rest-items";
 * //
 * getItem("ae7")
 *   .then(response);
 * // or
 * getItem("ae7", { authentication })
 *   .then(response)
 * ```
 * Get an item by id. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/item.htm) for more information.
 *
 * @param id - Item Id
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the data from the response.
 */
export function getItem(
  id: string,
  requestOptions?: IRequestOptions
): Promise<IItem> {
  const url = `${getPortalUrl(requestOptions)}/content/items/${id}`;

  // default to a GET request
  const options: IRequestOptions = {
    ...{ httpMethod: "GET" },
    ...requestOptions
  };
  return request(url, options);
}

/**
 * ```import { getItemData } from "@esri/arcgis-rest-items";
 * //
 * getItemData("ae7")
 *   .then(response)
 * // or
 * getItemData("ae7", { authentication })
 *   .then(response)
 * ```
 * Get the /data for an item. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/item-data.htm) for more information.
 * @param id - Item Id
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the json data for the item.
 */
export function getItemData(
  id: string,
  requestOptions?: IItemDataRequestOptions
): Promise<any> {
  const url = `${getPortalUrl(requestOptions)}/content/items/${id}/data`;
  // default to a GET request
  const options: IItemDataRequestOptions = {
    ...{ httpMethod: "GET", params: {} },
    ...requestOptions
  };

  if (options.file) {
    options.params.f = null;
  }

  return request(url, options);
}

export interface IGetRelatedItemsResponse {
  total: number;
  relatedItems: IItem[];
}

/**
 * ```
 * import { getRelatedItems } from "@esri/arcgis-rest-items";
 * //
 * getRelatedItems({
 *   id: "ae7",
 *   relationshipType: "Service2Layer" // or several ["Service2Layer", "Map2Area"]
 * })
 *   .then(response)
 * ```
 * Get the related items. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/related-items.htm) for more information.
 *
 * @param requestOptions - Options for the request
 * @returns A Promise to get some item resources.
 */
export function getRelatedItems(
  requestOptions: IItemRelationshipRequestOptions
): Promise<IGetRelatedItemsResponse> {
  const url = `${getPortalUrl(requestOptions)}/content/items/${requestOptions.id}/relatedItems`;

  const options:IItemRelationshipRequestOptions = {
    httpMethod: "GET",
    params: {
      direction: requestOptions.direction
    },
    ...requestOptions
  }

  if (typeof requestOptions.relationshipType === "string") {
    options.params.relationshipType = requestOptions.relationshipType;
  } else {
    options.params.relationshipTypes = requestOptions.relationshipType;
  }

  delete options.direction;
  delete options.relationshipType;

  return request(url, options);
}

/**
 * Get the resources associated with an item
 *
 * @param requestOptions - Options for the request
 * @returns A Promise to get some item resources.
 */
export function getItemResources(
  requestOptions: IItemIdRequestOptions
): Promise<any> {
  const url = `${getPortalUrl(requestOptions)}/content/items/${
    requestOptions.id
  }/resources`;

  // mix in user supplied params
  requestOptions.params = {
    ...requestOptions.params,
    num: 1000
  };

  return request(url, requestOptions);
}
