# MVP for Solana Grizzlython by Soliage team
import argparse
import numpy as np
import cv2
from skimage import io
from scipy.spatial.distance import cdist
from utils.haze import getRecoverScene

def cluster_colors(img_id, clusters, debug=False):
    img = io.imread(f"data/train_{img_id}.jpg")
    pixels = np.float32(img.reshape(-1, 3))
    
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 200, .1)
    flags = cv2.KMEANS_RANDOM_CENTERS
        
    a = 1
    hazed = False
    while a > 0:
        _, labels, palette = cv2.kmeans(pixels, clusters, None, criteria, 10, flags)
        if np.any([sum(i) for i in zip(*palette)] > np.full((1, 3), 300)) and not hazed:
            print("Clearing haze")
            img = getRecoverScene(img, refine=True)
            pixels = np.float32(img.reshape(-1, 3))
            hazed = True
            continue
        dist = np.tril(cdist(palette, palette, 'euclidean'))
        a = len(sum(np.where(np.logical_and(dist>0, dist<=20))))
        clusters -= 1
        
    _, counts = np.unique(labels, return_counts=True)
    
    rgb_trees = np.array([30, 30, 15]).reshape(1,-1)
    dist = cdist(palette, rgb_trees, 'euclidean')
    selected = np.where(dist<20)
    selected_sum = 0
    for n in selected[0]:
        selected_sum += counts[n]
    return selected_sum / sum(counts)


if __name__ == '__main__':
  parser = argparse.ArgumentParser(description='Pull intent and rawTransaction from CLI args')
  parser.add_argument('image_id', type=int,
                      help='Please pass an identifier for an image to scan. (>0)')
  args = parser.parse_args()

  print(cluster_colors(args.image_id, 5))