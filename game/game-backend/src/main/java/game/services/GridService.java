package game.services;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import lombok.Getter;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.exc.StreamWriteException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DatabindException;
import com.fasterxml.jackson.databind.ObjectMapper;

import game.models.GridDataModel;
import game.models.Grids;
import game.models.MapModelDTO;

@Getter
@Service
public class GridService {
    private Grids grids;

    public GridService() {
        super();
    }

    public Grids readTextFile(final String path) {

        final ObjectMapper mapper = new ObjectMapper();
        final File fileObj = new File(path);
        // normal path="./src/main/java/game/data.json"
        // use try-catch block to convert JSON data into Map
        try {
            final Grids data = mapper.readValue(
                    fileObj, new TypeReference<Grids>() {
                    });

            // print
            // get all
            // System.out.println("getAll : " + data);
            // first grid in the list
            // System.out.println("firstGridInTheList : " + data.getGrids().get(0));
            // highScores of grid
            // System.out.println(
            // "highScoresOfFirstGrid : " + data.getGrids().get(0).getHighScores());

            // set the attribute grids
            this.grids = data;

        } catch (IOException | SecurityException e) {
            e.printStackTrace();
        }
        return this.grids;
    }

    // Method called when path "allGrid" is asked
    public List<MapModelDTO> readAllGrids(final String path) throws NoGridStoredException {
        readTextFile(path);
        final List<MapModelDTO> res = grids.getGrids().stream().map(grid -> {
            return new MapModelDTO(grid.getId(), grid.getValues());
        }).collect(Collectors.toList());
        if (res.isEmpty()) {
            throw new NoGridStoredException();
        } else {
            return res;
        }
    }

    // Method called when path "{id}/gridHighScore" is asked
    public Map<String, Integer> readHighScores(final int id, final String path) throws IdNotPresentException {
        readTextFile(path);
        final List<Map<String, Integer>> res = grids.getGrids().stream().filter(grid -> id == grid.getId())
                .map(grid -> {
                    return grid.getHighScores();
                }).collect(Collectors.toList());
        if (res.isEmpty()) {
            throw new IdNotPresentException();
        } else {
            return res.get(0);
        }
    }

    // Method called when path "{id}/gridData" is asked
    public MapModelDTO readGridData(final int id, final String path) throws IdNotPresentException {
        readTextFile(path);
        final List<int[]> gridValues = grids.getGrids().stream().filter(grid -> id == grid.getId())
                .map(grid -> {
                    return grid.getValues();
                }).collect(Collectors.toList());
        if (gridValues.isEmpty()) {
            throw new IdNotPresentException();
        } else {
            return new MapModelDTO(id, gridValues.get(0));
        }
    }

    public int getNewId() {
        return Collections.max(grids.getGrids().stream().map(grid -> {
            return grid.getId();
        }).collect(Collectors.toList())) + 1;
    }

    public void writeTextFile(final int[] values, final String player, final int score, final String path) {
        readTextFile(path);
        final GridDataModel toAdd = new GridDataModel(values, player, score);

        final List<GridDataModel> foundedGrid = grids.getGrids().stream()
                .filter(grid -> Arrays.equals(values, grid.getValues())).map(grid -> {
                    return grid;
                }).collect(Collectors.toList());
        final List<GridDataModel> temp = grids.getGrids();
        int oldScore = 2000000000;
        if (foundedGrid.isEmpty()) {
            toAdd.setId(getNewId());

        } else {

            oldScore = Collections.max(foundedGrid.get(0).getHighScores().values());
            if (!foundedGrid.get(0).getHighScores().containsKey(player)) {
                oldScore = score + 100;
            }
            toAdd.setId(foundedGrid.get(0).getId());
            final Map<String, Integer> resHighScores = foundedGrid.get(0).getHighScores();
            resHighScores.put(player, score);
            toAdd.setHighScores(resHighScores);
            temp.remove(foundedGrid.get(0));
        }

        if (score < oldScore) {

            temp.add(toAdd);
            grids.setGrids(temp);

            // create object mapper instance
            final ObjectMapper mapper = new ObjectMapper();
            try {
                mapper.writeValue(Paths.get(path).toFile(), grids);
            } catch (StreamWriteException e) {
                e.printStackTrace();
            } catch (DatabindException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

    }

    public void writeGridsInFile(final Grids grids, final String path) {
        final ObjectMapper mapper = new ObjectMapper();
        try {
            mapper.writeValue(Paths.get(path).toFile(), grids);
        } catch (StreamWriteException e) {
            e.printStackTrace();
        } catch (DatabindException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
